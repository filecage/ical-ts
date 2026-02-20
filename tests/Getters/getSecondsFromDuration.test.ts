import {Duration} from "../../src/Parser/ValueTypes/Duration";
import getSecondsFromDuration from "../../src/Getters/getSecondsFromDuration";

describe('getSecondsFromDuration Tests', () => {
    const samples: [string, Duration, number][] = [
        ['weeks', {inverted: false, weeks: 4}, 2419200],
        ['days', {inverted: false, days: 5}, 432000],
        ['hours', {inverted: false, hours: 120}, 432000],
        ['minutes and seconds', {inverted: false, minutes: 4, seconds: 32}, 272],
        ['all properties', {inverted: false, weeks: 1, days: 2, hours: 3, minutes: 4, seconds: 5}, 788645],
        ['all properties, inverted', {inverted: true, weeks: 1, days: 2, hours: 3, minutes: 4, seconds: 5}, -788645],
    ];

    it.each(samples)('Should correctly calculate seconds from durations for %s', (name, duration, expectedSeconds) => {
        expect(getSecondsFromDuration(duration)).toEqual(expectedSeconds);
    });
});