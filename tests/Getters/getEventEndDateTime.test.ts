import {getEventEndDateTime} from "../../src/Getters/getEventEndDateTime";
import {ICS} from "../../src";
import VEVENT = ICS.VEVENT;
import {DateTime, DateTimeClass} from "../../src/Parser/ValueTypes/DateTime";
import DateTimeStart from "../../src/Parser/Properties/DateTimeStart";
import UniqueIdentifier from "../../src/Parser/Properties/UniqueIdentifier";
import DateTimeEnd from "../../src/Parser/Properties/DateTimeEnd";
import Duration from "../../src/Parser/Properties/Duration";

function createEvent (eventStart: DateTime, ) {
    return {
        UID: new UniqueIdentifier('foo', {}),
        DTSTART: new DateTimeStart(eventStart, {}),
    };
}

describe('getEventEndDateTime Tests', () => {
    const samples: [string, VEVENT.Published, string, string|undefined][] = [
        ['for specified end date', {
            ...createEvent(new DateTimeClass(new Date('2024-05-21T06:00:00'), false, false, 'Europe/Berlin') as DateTime),
            DTEND: new DateTimeEnd(new DateTimeClass(new Date('2024-05-22T08:42:23'), false, false, 'Europe/Berlin') as DateTime, {}),
        } as VEVENT.Published, '20240522T084223', 'Europe/Berlin'],

        ['for duration', {
            ...createEvent(new DateTimeClass(new Date('2024-05-21T06:00:00'), false, false, 'Europe/Berlin') as DateTime),
            DURATION: new Duration({inverted: false, hours: 26, minutes: 42, seconds: 23}, {}),
        } as VEVENT.Published, '20240522T084223', 'Europe/Berlin'],

        ['for specified end date (UTC)', {
            ...createEvent(new DateTimeClass(new Date('2024-05-21T06:00:00'), false, true, undefined) as DateTime),
            DTEND: new DateTimeEnd(new DateTimeClass(new Date('2024-05-22T08:42:23'), false, true, undefined) as DateTime, {}),
        } as VEVENT.Published, '20240522T084223Z', undefined],

        ['for duration (UTC)', {
            ...createEvent(new DateTimeClass(new Date('2024-05-21T06:00:00'), false, true, undefined) as DateTime),
            DURATION: new Duration({inverted: false, hours: 26, minutes: 42, seconds: 23}, {}),
        } as VEVENT.Published, '20240522T084223Z', undefined],
    ];

    it.each(samples)('Should correctly get event end DateTime %s', (name, event, expectedDateTimeString, expectedTimezoneIdentifier) => {
        const endDateTime = getEventEndDateTime(event);

        expect(endDateTime.toString()).toBe(expectedDateTimeString);
        if (expectedTimezoneIdentifier) {
            expect(endDateTime.timezoneIdentifier).toBe(expectedTimezoneIdentifier);
            expect(endDateTime.isUTC).toBe(false);
        } else {
            expect(endDateTime.timezoneIdentifier).toBeUndefined();
            expect(endDateTime.isUTC).toBe(true);
        }
    });

    it('Should throw for event without DTEND and DURATION', () => {
        expect(() => getEventEndDateTime(createEvent(new DateTimeClass(new Date('2024-05-21T06:00:00'), false, false, 'Europe/Berlin') as DateTime) as VEVENT.Published)).toThrow(`Event must have either 'DTEND' or 'DURATION' property to get event end time`)
    })
});