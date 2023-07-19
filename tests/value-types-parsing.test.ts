import {parseProperty} from "../src/Parser/parseProperties";
import {parseDateTime, parseList, parseValueRaw} from "../src/Parser/parseValues";
import {DateTime} from "../src/Parser/ValueTypes/DateTime";
import RecurrenceDateTimes from "../src/Parser/Properties/RecurrenceDateTimes";

describe('Property ValueType Parsing and  Encoding', () => {

    describe('TimeTransparency', () => {
        it('Should throw for an invalid time transparency', () => {
            expect(() => parseProperty('TRANSP', 'FOOBAR')).toThrowError(`Invalid value 'FOOBAR' for property 'TimeTransparency', must be one of: OPAQUE, TRANSPARENT`);
        });
    });

    describe('RecurrenceDateTime', () => {
        it ('Should parse multiple RDATE datetime values', () => {
            const rdate = parseProperty('RDATE', '19970714T123000Z,20230822T223045Z,') as RecurrenceDateTimes;

            expect(rdate).toBeInstanceOf(RecurrenceDateTimes);
            expect(rdate.value).toHaveLength(2);

            const [first, second] = rdate.value;
            expect(first.toString()).toEqual('19970714T123000Z');
            expect(second.toString()).toEqual('20230822T223045Z');
        });
    });
});

describe('Value Type Parsers', () => {
    describe('Lists', () => {
        it('Should parse an unescaped list', () => expect(parseList('foo,bar')).toEqual(['foo', 'bar']));
        it('Should parse a list with a single item', () => expect(parseList('foo')).toEqual(['foo']));
        it('Should parse a list with a single item and trailing comma', () => expect(parseList('foo,')).toEqual(['foo']));
        it('Should parse a list with an empty item', () => expect(parseList('foo,,bar')).toEqual(['foo', 'bar']));
        it('Should parse a list with identical items', () => expect(parseList('foo,foo')).toEqual(['foo', 'foo']));
        it('Should parse enquoted items', () => expect(parseList('"foo","foo"')).toEqual(['foo', 'foo']));
        it('Should parse enquoted items with escaped quote in value', () => expect(parseList('"foo","foo \\"foo\\" bar"')).toEqual(['foo', 'foo "foo" bar']));
        it('Should parse enquoted items with separator in value', () => expect(parseList('"foo,bar","baz"')).toEqual(['foo,bar', 'baz']));
        it('Should parse mixed enquoted items', () => expect(parseList('"foo,bar","baz \\"boo\\"",bam')).toEqual(['foo,bar', 'baz "boo"', 'bam']));
    });

    describe('Value Encoding', () => {
        it('Should parse a simple string value', () => expect(parseValueRaw('foobar')).toEqual('foobar'));
        it('Should parse a simple string value with a quote', () => expect(parseValueRaw('foo"bar')).toEqual('foo"bar'));
        it('Should parse enquoted items', () => expect(parseValueRaw('"foo"')).toEqual('foo'));
        it('Should parse enquoted items with escaped quote in value', () => expect(parseValueRaw('"foo \\"foo\\" bar"')).toEqual('foo "foo" bar'));
        it('Treats comma separated, enquoted list values as as-is value', () => expect(parseValueRaw('"foo","bar"')).toEqual('"foo","bar"'));
    });

    describe('DateTime', () => {
        it('Should parse date', () => {
            const date = parseDateTime('20230719', {});

            expect(date.isDateOnly).toBeTruthy();
            expect(date.toString()).toEqual('20230719');
            expect(date.date).toEqual((new Date('2023-07-19')));

            // Timezones have no effect on date-only values
            expect(date.isUTC).toBeFalsy();
            expect(date.timezoneIdentifier).toBeUndefined();
        });

        it('Should parse UTC datetime', () => {
            const date = parseDateTime('20230719T114104Z', {});

            expect(date.toString()).toEqual('20230719T114104Z');
            expect(date.date).toEqual((new Date('2023-07-19T11:41:04Z')));
            expect(date.isDateOnly).toBeFalsy();
            expect(date.isUTC).toBeTruthy();
            expect(date.timezoneIdentifier).toBeUndefined();
        });

        it('Should parse local datetime', () => {
            const date = parseDateTime('20230719T134104', {TZID: 'Europe/Berlin'});

            expect(date.toString()).toEqual('20230719T134104');
            expect(date.date).toEqual((new Date('2023-07-19T11:41:04Z')));
            expect(date.isDateOnly).toBeFalsy();
            expect(date.isUTC).toBeFalsy();
            expect(date.timezoneIdentifier).toEqual('Europe/Berlin');
        });

        it('Should parse floating datetime', () => {
            const date = parseDateTime('20120817T032509', {});

            expect(date.toString()).toEqual('20120817T032509');
            expect(date.date).toEqual((new Date('2012-08-17T03:25:09')));
            expect(date.isDateOnly).toBeFalsy();
            expect(date.isUTC).toBeFalsy();
            expect(date.timezoneIdentifier).toBeUndefined();
        })
    });

});