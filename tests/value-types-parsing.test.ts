import {parseProperty} from "../src/Parser/parseProperties";
import RecurrenceDateTimes from "../src/Parser/Properties/RecurrenceDateTimes";
import {parseList, parseValueRaw} from "../src/Parser/parseValues";

describe('Property ValueType Parsing and  Encoding', () => {

    describe('TimeTransparency', () => {
        it('Should throw for an invalid time transparency', () => {
            expect(() => parseProperty('TRANSP', 'FOOBAR')).toThrowError(`Invalid value 'FOOBAR' for property 'TimeTransparency', must be one of: OPAQUE, TRANSPARENT`);
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
});