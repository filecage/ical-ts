import formatOffset from "../../src/Formatters/formatOffset";

describe('formatOffset Tests', () => {
    const samples: [string, number][] = [
        ['+0000', 0],
        ['+0800', 28800],
        ['+1234', 45240],
        ['+123456', 45296],
        ['-0800', -28800],
        ['-1234', -45240],
        ['-123456', -45296],
        ['+3200', 115200],
    ];

    it.each(samples)('Should correctly get offset in seconds for %s', (expectedOffset, offsetSeconds) => {
        expect(formatOffset(offsetSeconds)).toBe(expectedOffset);
    });
});