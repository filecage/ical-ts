import {parseRecurrence} from "../../src/Parser/parseValues";
import iterateReccurences from "../../src/Getters/iterateReccurences";
import {DateTimeClass, UTCDateTime} from "../../src/Parser/ValueTypes/DateTime";
import {Recur, RecurFrequency} from "../../src/Parser/ValueTypes/Recur";

describe('iterateReccurences Tests', () => {
    // Samples are taken from https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html
    const rruleSamples: [string,string][] = [
        ['Daily basic', 'FREQ=DAILY;COUNT=5'], // Every day for 5 occurrences
        ['Daily with interval', 'FREQ=DAILY;INTERVAL=2;COUNT=5'], // Every other day for 5 occurrences
        ['Weekly weekdays', 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=6'], // Monday, Wednesday, Friday for 6 occurrences
        // ['Weekly weekends', 'FREQ=WEEKLY;BYDAY=SA,SU;COUNT=4'], // Saturday and Sunday for 4 occurrences
        // ['Monthly specific date', 'FREQ=MONTHLY;BYMONTHDAY=15;COUNT=6'], // 15th of each month for 6 occurrences
        // ['Monthly first Monday', 'FREQ=MONTHLY;BYDAY=1MO;COUNT=6'], // First Monday of each month for 6 occurrences
        // ['Monthly last day', 'FREQ=MONTHLY;BYMONTHDAY=-1;COUNT=6'], // Last day of each month for 6 occurrences
        // ['Yearly Christmas', 'FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25;COUNT=3'], // December 25th for 3 years
        // ['Yearly Thanksgiving', 'FREQ=YEARLY;BYMONTH=11;BYDAY=4TH;COUNT=3'], // 4th Thursday of November for 3 years
        // ['Bi-weekly Friday', 'FREQ=WEEKLY;INTERVAL=2;BYDAY=FR;COUNT=6'], // Every other Friday for 6 occurrences
        // ['Quarterly first day', 'FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=1;COUNT=4'], // First day of every quarter for 4 occurrences
        // ['Time-bounded weekly', 'FREQ=WEEKLY;BYDAY=TU;UNTIL=20240301T000000Z'], // Every Tuesday until March 1, 2024
        // ['Complex multiple BY rules', 'FREQ=YEARLY;BYMONTH=6,12;BYMONTHDAY=1,15;COUNT=8'], // 1st and 15th of June and December
        // ['First weekday of month', 'FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=1;COUNT=6'], // First weekday of each month using BYSETPOS
        // ['Leap year February 29', 'FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=29;COUNT=3'], // February 29th (leap years only)
        // ['Weekly with WKST', 'FREQ=WEEKLY;BYDAY=MO;WKST=SU;COUNT=4'], // Every Monday with week starting on Sunday
        // ['Zero BYHOUR/BYMINUTE/BYSECOND offsets', 'FREQ=MONTHLY;BYHOUR=0;BYMINUTE=0;BYSECOND=0'] // Time Offsets with value 0
    ] as const;

    it.each(rruleSamples)('Should correctly generate RRule recurrences for %s', (name, sample) => {
        const {toString, ...rrule} = parseRecurrence(sample);

        expect([...iterateReccurences(rrule, {DTSTART: new DateTimeClass(new Date('2026-02-23'), true, true, undefined) as UTCDateTime, VTIMEZONE: null})]).toMatchSnapshot();
    });

    describe('Frequency iteration', () => {

        const frequencies: [RecurFrequency, number][] = [
            [RecurFrequency.Secondly, 61],
            [RecurFrequency.Minutely, 61],
            [RecurFrequency.Hourly, 25],
            [RecurFrequency.Daily, 30],
            [RecurFrequency.Weekly, 5],
            [RecurFrequency.Monthly, 13],
            [RecurFrequency.Yearly, 5],
        ];

        // We're picking a leap year to make sure that "daily" generates February 29 and also moves to March 1
        const start = new DateTimeClass(new Date('2028-02-01'), true, true, undefined) as UTCDateTime;

        it.each(frequencies)('iterates for %s frequency', (frequency, count) => {
            const recurrences = [...iterateReccurences(parseRecurrence(`FREQ=${frequency};COUNT=${count}`), {
                DTSTART: start,
                VTIMEZONE: null
            })];

            expect(recurrences).toMatchSnapshot();
        });

        it('correctly iterates over the end of month', () => {
            const recurrences = [...iterateReccurences(parseRecurrence(`FREQ=MONTHLY;COUNT=14`), {
                DTSTART: new DateTimeClass(new Date('2027-01-31'), true, true, undefined) as UTCDateTime,
                VTIMEZONE: null
            })];

            expect(recurrences).toMatchSnapshot();
        });

        it('correctly iterates yearly over February 29', () => {
            const recurrences = [...iterateReccurences(parseRecurrence(`FREQ=YEARLY;COUNT=5`), {
                DTSTART: new DateTimeClass(new Date('2028-02-29'), true, true, undefined) as UTCDateTime,
                VTIMEZONE: null
            })];

            expect(recurrences).toMatchSnapshot();
        });

        it('correctly skips leap year in 1900', () => {
            const recurrences = [...iterateReccurences(parseRecurrence(`FREQ=YEARLY;COUNT=5`), {
                DTSTART: new DateTimeClass(new Date('1896-02-29'), true, true, undefined) as UTCDateTime,
                VTIMEZONE: null
            })];

            expect(recurrences).toMatchSnapshot();
        });
    });



});