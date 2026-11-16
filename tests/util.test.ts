import indexOfUnquoted from "../src/Util/indexOfUnquoted";

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
