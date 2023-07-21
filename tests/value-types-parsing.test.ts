import {parseProperty} from "../src/Parser/parseProperties";
import {parseDateTime, parseDuration, parseList, parsePeriod, parseValueRaw} from "../src/Parser/parseValues";
import {DateTime} from "../src/Parser/ValueTypes/DateTime";
import RecurrenceDateTimes from "../src/Parser/Properties/RecurrenceDateTimes";
import {Duration} from "../src/Parser/ValueTypes/Duration";

describe('Property ValueType Parsing and Encoding', () => {

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
        });

        it('Throws for invalid date', () => {
            expect(() => parseDateTime('20231331', {})).toThrowError(`Invalid datetime value '20231331': not a valid date/datetime`);
        });

        it('Throws for invalid time', () => {
            expect(() => parseDateTime('20231224T255931Z', {})).toThrowError(`Invalid datetime value '20231224T255931Z': not a valid date/datetime`);
        });
    });

    describe('Duration', () => {
        it('Should parse a duration with all possible designators', () => {
            const duration = parseDuration('P3W4DT5H6M7S');
            expect(duration).toMatchObject<Duration>({
                inverted: false, weeks: 3, days: 4, hours: 5, minutes: 6, seconds: 7
            });

            expect(duration.toString()).toEqual('P3W4DT5H6M7S');
        });

        it('Should parse a duration without time designators', () => {
            const duration = parseDuration('P3W4D');
            expect(duration).toMatchObject<Duration>({
                inverted: false, weeks: 3, days: 4, hours: undefined, minutes: undefined, seconds: undefined
            });

            expect(duration.toString()).toEqual('P3W4D');
        });

        it('Should parse a duration time designators only', () => {
            const duration = parseDuration('PT5H6M7S');
            expect(duration).toMatchObject<Duration>({
                inverted: false, weeks: undefined, days: undefined, hours: 5, minutes: 6, seconds: 7
            });

            expect(duration.toString()).toEqual('PT5H6M7S');
        });

        it('Should parse a duration with large numbers', () => {
            const duration = parseDuration('P3000W4000DT5000H6000M7000S');
            expect(duration).toMatchObject<Duration>({
                inverted: false, weeks: 3000, days: 4000, hours: 5000, minutes: 6000, seconds: 7000
            });

            expect(duration.toString()).toEqual('P3000W4000DT5000H6000M7000S');
        });

        it('Should parse a negative duration', () => {
            const duration = parseDuration('-P1DT5H30M');
            expect(duration).toMatchObject<Duration>({
                inverted: true, days: 1, hours: 5, minutes: 30
            });

            expect(duration.toString()).toEqual('-P1DT5H30M');
        });

        it('Should parse a fractional duration', () => {
            const duration = parseDuration('P1.5D');
            expect(duration).toMatchObject<Duration>({
                inverted: false, days: 1.5,
            });
        });

        it('Should parse a fractional duration with comma fraction', () => {
            const duration = parseDuration('P1,5D');
            expect(duration).toMatchObject<Duration>({
                inverted: false, days: 1.5,
            });
        });

        it('Should parse zero duration', () => {
            const duration = parseDuration('PT0S');
            expect(duration.toString()).toMatch('PT0S');
            expect(duration).toMatchObject<Duration>({
                inverted: false, seconds: 0,
            });
        });

        it('Should throw for empty period', () => {
            expect(() => parseDuration('P')).toThrowError(`Invalid duration value 'P'`);
        });
    });

    describe('Period', () => {
        it('Should parse a date-to-date period', () => {
            const period = parsePeriod('20230405T133000Z/20230408T110000Z', {});

            expect(period.start.toString()).toEqual('20230405T133000Z');
            expect(period.end?.toString()).toEqual('20230408T110000Z');
            expect(period.duration).toBeUndefined();
        });

        it('Should parse a date-duration period', () => {
            const period= parsePeriod('20230405T133000Z/PT5H30M', {});

            expect(period.start.toString()).toEqual('20230405T133000Z');
            expect(period.end?.toString()).toBeUndefined()
            expect(period.duration?.toString()).toEqual('PT5H30M');
        });

        it('Should pass TZID when parsing start/end datetimes', () => {
            const period = parsePeriod('20230405T133000/20230408T110000', {TZID: 'Europe/Berlin'});

            expect(period.start.timezoneIdentifier).toEqual('Europe/Berlin');
            expect(period.end?.timezoneIdentifier).toEqual('Europe/Berlin');
        });

        it('Should pass TZID when parsing date-duration datetimes', () => {
            const period = parsePeriod('20230405T133000/PT5H30M', {TZID: 'Europe/Berlin'});

            expect(period.start.timezoneIdentifier).toEqual('Europe/Berlin');
        });

        it('Should throw for an invalid period', () => {
            expect(() => parsePeriod('20230405', {})).toThrowError(`Invalid period value '20230405': missing end/duration`)
        });
    });
});