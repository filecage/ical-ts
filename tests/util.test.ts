import indexOfUnquoted from "../src/Util/indexOfUnquoted";
import unescape from "../src/Parser/unescape";

describe('unescape', () => {
    const decodeEscape = (character: string) => character === 'n' ? '\n' : character;

    it.each([
        ['', ''],
        ['foo', 'foo'],
        ['a^nb', 'a\nb'],
        ['a^xb', 'axb'],
        ['^^n', '^n'],
        ['^^^n', '^\n'],
        ['^^^^', '^^'],
        ['foo^', 'foo'],
    ])('Should unescape %j as %j', (input, expected) => {
        expect(unescape(input, '^', decodeEscape, false)).toBe(expected);
    });

    it('Should support a custom dangling escape replacement', () => {
        expect(unescape('foo^', '^', decodeEscape, true)).toBe('foo^');
    });

    it('Should decode only escaped characters', () => {
        const decoded: string[] = [];
        const decode = (character: string) => {
            decoded.push(character);
            return character.toUpperCase();
        };
        expect(unescape('a^b^^c^', '^', decode, false)).toBe('aB^c');
        expect(decoded).toEqual(['b', '^']);
    });
});

describe('indexOfUnquoted', () => {
    it.each([
        ['a;b;c', ';', 1],
        [';a', ';', 0],
        ['"a;b";"c;d";e', ';', 5],
        ['a,b', ',', 1],
        ['', ';', -1],
        ['abc', ';', -1],
        ['"a;b"', ';', -1],
        ['"a;b', ';', -1],
        ['"a\\";tail', ';', 4],
    ])('Should search %j for an unquoted %j (expected index %i)', (input, delimiter, expected) => {
        expect(indexOfUnquoted(input, delimiter)).toBe(expected);
    });

    it.each([
        [2, 3],
        [3, 3],
        [5, -1],
        [6, -1],
    ])('Should search from index %i (expected index %i)', (start, expected) => {
        expect(indexOfUnquoted('a;b;c', ';', start)).toBe(expected);
    });

    it.each([
        ['^";tail', 2],
        ['"a^";b";tail', 7],
        ['"a^^";tail', 5],
        ['"a^^^";tail', -1],
        ['"a^b";tail', 5],
        ['a^;b', 2],
    ])('Should handle the configured escape character in %j (expected index %i)', (input, expected) => {
        expect(indexOfUnquoted(input, ';', 0, '^')).toBe(expected);
    });
});
