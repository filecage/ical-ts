import {parseProperty} from "../src/Parser/parseProperties";
import {parseDateTime, parseDuration, parseList, parseOffset, parsePeriod, parseRecurrence, parseValueRaw} from "../src/Parser/parseValues";
import RecurrenceDateTimes from "../src/Parser/Properties/RecurrenceDateTimes";
import {Duration} from "../src/Parser/ValueTypes/Duration";
import {deleteUndefined} from "./util/deleteUndefined";

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

    describe('Offset', () => {
        const samples: [string, number][] = [
            ['+000000', 0],
            ['+0800', 28800],
            ['+1234', 45240],
            ['+123456', 45296],
            ['-0800', -28800],
            ['-1234', -45240],
            ['-123456', -45296],
            ['+3200', 115200],
        ];

        it.each(samples)('Should correctly parse Offset for %s', (offsetString, expectedOffsetSeconds) => {
            const offset = parseOffset(offsetString);

            expect(offset).toHaveProperty('seconds', expectedOffsetSeconds);
            expect(String(offset)).toBe(offsetString);
        });
    });

    describe('RRule', () => {
        // Samples are taken from https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html
        const rruleSamples: [string,string][] = [
            ['Daily basic', 'FREQ=DAILY;COUNT=5'], // Every day for 5 occurrences
            ['Daily with interval', 'FREQ=DAILY;INTERVAL=2;COUNT=5'], // Every other day for 5 occurrences
            ['Weekly weekdays', 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=6'], // Monday, Wednesday, Friday for 6 occurrences
            ['Weekly weekends', 'FREQ=WEEKLY;BYDAY=SA,SU;COUNT=4'], // Saturday and Sunday for 4 occurrences
            ['Monthly specific date', 'FREQ=MONTHLY;BYMONTHDAY=15;COUNT=6'], // 15th of each month for 6 occurrences
            ['Monthly first Monday', 'FREQ=MONTHLY;BYDAY=1MO;COUNT=6'], // First Monday of each month for 6 occurrences
            ['Monthly last day', 'FREQ=MONTHLY;BYMONTHDAY=-1;COUNT=6'], // Last day of each month for 6 occurrences
            ['Yearly Christmas', 'FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25;COUNT=3'], // December 25th for 3 years
            ['Yearly Thanksgiving', 'FREQ=YEARLY;BYMONTH=11;BYDAY=4TH;COUNT=3'], // 4th Thursday of November for 3 years
            ['Bi-weekly Friday', 'FREQ=WEEKLY;INTERVAL=2;BYDAY=FR;COUNT=6'], // Every other Friday for 6 occurrences
            ['Quarterly first day', 'FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=1;COUNT=4'], // First day of every quarter for 4 occurrences
            ['Time-bounded weekly', 'FREQ=WEEKLY;BYDAY=TU;UNTIL=20240301T000000Z'], // Every Tuesday until March 1, 2024
            ['Complex multiple BY rules', 'FREQ=YEARLY;BYMONTH=6,12;BYMONTHDAY=1,15;COUNT=8'], // 1st and 15th of June and December
            ['First weekday of month', 'FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=1;COUNT=6'], // First weekday of each month using BYSETPOS
            ['Leap year February 29', 'FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=29;COUNT=3'], // February 29th (leap years only)
            ['Weekly with WKST', 'FREQ=WEEKLY;BYDAY=MO;WKST=SU;COUNT=4'], // Every Monday with week starting on Sunday
            ['Zero BYHOUR/BYMINUTE/BYSECOND offsets', 'FREQ=MONTHLY;BYHOUR=0;BYMINUTE=0;BYSECOND=0'] // Time Offsets with value 0
        ] as const;

        it.each(rruleSamples)('Should correctly parse RRule segments for %s', (name, sample) => {
            const {toString, ...rrule} = parseRecurrence(sample);

            expect(deleteUndefined(rrule)).toMatchSnapshot();
            expect(toString ? toString() : rrule.toString()).toMatchSnapshot();
        });

        const brokenRrules: [string, string, string][] = [
            ['missing frequency', '', `Invalid recurrence value '': missing or invalid FREQ`],
            ['invalid frequency', 'FREQ=PERIODICALLY', `Invalid recurrence value 'FREQ=PERIODICALLY': missing or invalid FREQ`],
            ['invalid negative interval', 'FREQ=DAILY;INTERVAL=-1', `Invalid recurrence value 'FREQ=DAILY;INTERVAL=-1': invalid non-positive INTERVAL`],
            ['invalid zero interval', 'FREQ=DAILY;INTERVAL=0', `Invalid recurrence value 'FREQ=DAILY;INTERVAL=0': invalid non-positive INTERVAL`],
            ['Negative COUNT', 'FREQ=DAILY;COUNT=-5', `Invalid recurrence value 'FREQ=DAILY;COUNT=-5': invalid non-positive COUNT`],
            ['Zero COUNT', 'FREQ=DAILY;COUNT=0', `Invalid recurrence value 'FREQ=DAILY;COUNT=0': invalid non-positive COUNT`],
            ['Invalid month', 'FREQ=YEARLY;BYMONTH=13', `Invalid number: '13': not in range of -12 to 12`],
            ['Invalid month zero', 'FREQ=YEARLY;BYMONTH=0', `Invalid number: '0': not in range of -12 to 12`],
            ['Invalid day of month', 'FREQ=MONTHLY;BYMONTHDAY=32', `Invalid number: '32': not in range of -31 to 31`],
            ['Invalid day of month zero', 'FREQ=MONTHLY;BYMONTHDAY=0', `Invalid number: '0': not in range of -31 to 31`],
            ['Invalid weekday', 'FREQ=WEEKLY;BYDAY=XX', `Invalid recurrence weekday value 'XX' at index #0: invalid format`],
            ['Invalid weekday position zero', 'FREQ=MONTHLY;BYDAY=0MO', `Invalid number: '0': not in range of 1 to 53`],
            ['Invalid weekday position high', 'FREQ=MONTHLY;BYDAY=54TU', `Invalid number: '54': not in range of 1 to 53`],
            ['Invalid week number', 'FREQ=YEARLY;BYWEEKNO=54', `Invalid number: '54': not in range of -53 to 53`],
            ['Invalid week number zero', 'FREQ=YEARLY;BYWEEKNO=0', `Invalid number: '0': not in range of -53 to 53`],
            ['Invalid year day', 'FREQ=YEARLY;BYYEARDAY=367', `Invalid number: '367': not in range of -366 to 366`],
            ['Invalid year day zero', 'FREQ=YEARLY;BYYEARDAY=0', `Invalid number: '0': not in range of -366 to 366`],
            ['Invalid hour', 'FREQ=DAILY;BYHOUR=25', `Invalid number: '25': not in range of 0 to 23`],
            ['Invalid minute', 'FREQ=DAILY;BYMINUTE=60', `Invalid number: '60': not in range of 0 to 59`],
            ['Invalid WKST', 'FREQ=WEEKLY;WKST=XX', `Invalid recurrence weekday 'XX': not a valid weekday`],
            ['Invalid UNTIL format', 'FREQ=DAILY;UNTIL=2024-01-01', `Invalid date value for date/datetime '2024-01-01'`],
            ['COUNT and UNTIL together', 'FREQ=DAILY;COUNT=5;UNTIL=20240301T000000Z', `Invalid recurrence value 'FREQ=DAILY;COUNT=5;UNTIL=20240301T000000Z': COUNT and UNTIL are mutually exclusive`],
            ['Invalid BYSETPOS range', 'FREQ=MONTHLY;BYDAY=MO;BYSETPOS=367', `Invalid number: '367': not in range of -366 to 366`],
            ['BYSETPOS without other BY rule', 'FREQ=MONTHLY;BYSETPOS=1', `Invalid recurrence value 'FREQ=MONTHLY;BYSETPOS=1': BYSETPOS must be used in conjunction with another 'BY-' defintion`],
            ['Invalid INTERVAL zero', 'FREQ=DAILY;INTERVAL=0', `Invalid recurrence value 'FREQ=DAILY;INTERVAL=0': invalid non-positive INTERVAL`],
            ['Malformed syntax', 'FREQ=DAILY,COUNT=5', `Invalid recurrence value 'FREQ=DAILY,COUNT=5': missing or invalid FREQ`],
            ['Missing equals', 'FREQ DAILY;COUNT=5', `Invalid recurrence value 'FREQ DAILY;COUNT=5': missing or invalid FREQ`],
            ['Case sensitive violation', 'freq=daily;count=5', `Invalid recurrence value 'freq=daily;count=5': missing or invalid FREQ`],
            ['Empty parameter value', 'FREQ=DAILY;COUNT=', `Invalid number value ''`],
            ['Invalid WKST with Wnumber', 'FREQ=WEEKLY;WKST=1', `Invalid recurrence weekday '1': not a valid weekday`]
        ];

        it.each(brokenRrules)('Should throw for %s', (name, sample, expectedError) => {
            expect(() => parseRecurrence(sample)).toThrow(expectedError);
        });
    })

});