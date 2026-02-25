import {ICS} from "../../src";
import {DateTime} from "../../src/Parser/ValueTypes/DateTime";
import DateTimeStart from "../../src/Parser/Properties/DateTimeStart";
import TimeZoneIdentifier from "../../src/Parser/Properties/TimeZoneIdentifier";
import {getDateFromDateTime} from "../../src/Getters/getDateFromDateTime";
import TimeZoneOffsetFrom from "../../src/Parser/Properties/TimeZoneOffsetFrom";
import TimeZoneOffsetTo from "../../src/Parser/Properties/TimeZoneOffsetTo";
import RecurrenceRule from "../../src/Parser/Properties/RecurrenceRule";
import {parseDateTime, parseOffset, parseRecurrence} from "../../src/Parser/parseValues";
import TimeZoneName from "../../src/Parser/Properties/TimeZoneName";


const VTIMZEZONES: ICS.VTIMEZONE[] = [
    {
        TZID: new TimeZoneIdentifier('Europe/Berlin', {}),
        DAYLIGHT: [{
            TZNAME: new TimeZoneName('CEST', {}),
            TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0100'), {}),
            TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0200'), {}),
            DTSTART: new DateTimeStart(parseDateTime('19700329T020000', {}), {}),
            RRULE: new RecurrenceRule(parseRecurrence('FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU'), {}),
        }],
        STANDARD: [
            {
                TZNAME: new TimeZoneName('CET', {}),
                TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0200'), {}),
                TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0100'), {}),
                DTSTART: new DateTimeStart(parseDateTime('19701025T030000', {}), {}),
                RRULE: new RecurrenceRule(parseRecurrence('FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU'), {}),
            }
        ]
    },
    {
        TZID: new TimeZoneIdentifier('Etc/GMT', {}),
        STANDARD: [
            {
                TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0000'), {}),
                TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0000'), {}),
                DTSTART: new DateTimeStart(parseDateTime('19710101T000000', {}), {}),
            }
        ]
    },
    {
        TZID: new TimeZoneIdentifier('Etc/Narnia', {}),
        DAYLIGHT: [
            {
                // First daylight period: +0300 (Apr-Jun)
                TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0200'), {}),
                TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0300'), {}),
                DTSTART: new DateTimeStart(parseDateTime('19800401T020000', {}), {}),
                RRULE: new RecurrenceRule(parseRecurrence('FREQ=YEARLY;BYMONTH=4;BYMONTHDAY=1'), {}),
            },
            {
                // Second daylight period: +0400 (Jul-Aug)
                TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0300'), {}),
                TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0400'), {}),
                DTSTART: new DateTimeStart(parseDateTime('19900701T020000', {}), {}),
                RRULE: new RecurrenceRule(parseRecurrence('FREQ=YEARLY;BYMONTH=7;BYMONTHDAY=1'), {}),
            },
            {
                // Third daylight period: +0500 (Sep-Oct)
                TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0400'), {}),
                TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0500'), {}),
                DTSTART: new DateTimeStart(parseDateTime('20000901T020000', {}), {}),
                RRULE: new RecurrenceRule(parseRecurrence('FREQ=YEARLY;BYMONTH=9;BYMONTHDAY=1'), {}),
            }
        ],
        STANDARD: [
            {
                // First standard period: +0100 (Nov-Dec)
                TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0500'), {}),
                TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0100'), {}),
                DTSTART: new DateTimeStart(parseDateTime('19751101T030000', {}), {}),
                RRULE: new RecurrenceRule(parseRecurrence('FREQ=YEARLY;BYMONTH=11;BYMONTHDAY=1'), {}),
            },
            {
                // Second standard period: +0000 (Jan-Feb)
                TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0100'), {}),
                TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0000'), {}),
                DTSTART: new DateTimeStart(parseDateTime('19850101T020000', {}), {}),
                RRULE: new RecurrenceRule(parseRecurrence('FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1'), {}),
            },
            {
                // Third standard period: +0200 (Mar)
                TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0000'), {}),
                TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0200'), {}),
                DTSTART: new DateTimeStart(parseDateTime('19950301T020000', {}), {}),
                RRULE: new RecurrenceRule(parseRecurrence('FREQ=YEARLY;BYMONTH=3;BYMONTHDAY=1'), {}),
            }
        ]
    },
];

describe('getDateFromDateTime Tests', () => {
    const samples: [string, DateTime, number][] = [
        ['UTC date and time', parseDateTime('20240523T095445Z', {}), 1716458085000],
        ['Floating date and time', parseDateTime('20240523T115445', {}), 1716465285000],
        ['Etc/GMT', parseDateTime('20240523T095445', {TZID: 'Etc/GMT'}), 1716458085000],
        ['Europe/Berlin in daylight time', parseDateTime('20240523T115445', {TZID: 'Europe/Berlin'}), 1716458085000],
        ['Europe/Berlin in standard time', parseDateTime('20240323T115445', {TZID: 'Europe/Berlin'}), 1711191285000],

        // Etc/Narnia timezone tests - testing each period
        ['Etc/Narnia - January (standard +0000)', parseDateTime('20240115T100000', {TZID: 'Etc/Narnia'}), 1705316400000],
        ['Etc/Narnia - February (standard +0000)', parseDateTime('20240215T100000', {TZID: 'Etc/Narnia'}), 1708081200000],
        ['Etc/Narnia - March (standard +0200)', parseDateTime('20240315T100000', {TZID: 'Etc/Narnia'}), 1710493200000],
        ['Etc/Narnia - April (daylight +0300)', parseDateTime('20240415T100000', {TZID: 'Etc/Narnia'}), 1713168000000],
        ['Etc/Narnia - May (daylight +0300)', parseDateTime('20240515T100000', {TZID: 'Etc/Narnia'}), 1715760000000],
        ['Etc/Narnia - July (daylight +0400)', parseDateTime('20240715T100000', {TZID: 'Etc/Narnia'}), 1721030400000],
        ['Etc/Narnia - August (daylight +0400)', parseDateTime('20240815T100000', {TZID: 'Etc/Narnia'}), 1723708800000],
        ['Etc/Narnia - September (daylight +0500)', parseDateTime('20240915T100000', {TZID: 'Etc/Narnia'}), 1726383600000],
        ['Etc/Narnia - October (daylight +0500)', parseDateTime('20241015T100000', {TZID: 'Etc/Narnia'}), 1729062000000],
        ['Etc/Narnia - November (standard +0100)', parseDateTime('20241115T100000', {TZID: 'Etc/Narnia'}), 1731664800000],
        ['Etc/Narnia - December (standard +0100)', parseDateTime('20241215T100000', {TZID: 'Etc/Narnia'}), 1734256800000],
    ];

    it.each(samples)('Should correctly get date from DateTime %s', (name, dateTime, expectedUnixTimestampMS) => {
        expect(getDateFromDateTime(dateTime, VTIMZEZONES).valueOf()).toBe(expectedUnixTimestampMS);
    });
});