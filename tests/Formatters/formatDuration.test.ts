import {Duration} from "../../src/Parser/ValueTypes/Duration";
import {formatDuration} from "../../src/Formatters/formatDuration";


describe('formatDuration Tests', () => {
    const samples: [string, Duration, string][] = [
        ['Simple one-week duration', { inverted: false, weeks: 1 }, 'P1W'],
        ['Full date and time duration', { inverted: false, days: 3, hours: 4, minutes: 30, seconds: 15 }, 'P3DT4H30M15S'],
        ['Negative (inverted) duration', { inverted: true, days: 2, hours: 1 }, '-P2DT1H'],
        ['Time-only duration', { inverted: false, minutes: 45 }, 'PT45M'],
        ['Large mixed duration', { inverted: false, weeks: 1, days: 2, hours: 6, minutes: 20 }, 'P1W2DT6H20M'],
        ['Seconds only', { inverted: false, seconds: 30 }, 'PT30S'],
    ];

    it.each(samples)('Should correctly get offset in seconds for %s', (_, duration, expectedDuration) => {
        expect(formatDuration(duration)).toBe(expectedDuration);
    });
});