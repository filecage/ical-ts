import {XOR} from "ts-xor";
import {Recur, RecurFrequency, RecurWeekday} from "../Parser/ValueTypes/Recur";
import {DateTime} from "../Parser/ValueTypes/DateTime";
import {ICS} from "../ICS";
import {Period} from "../Parser/ValueTypes/Period";
import {getDateFromDateTime} from "./getDateFromDateTime";

/**
 * @param {Recur} recur The recurrence rule
 * @param options You can either pass the calendar properties (EXDATE, RDATE, DTSTART), but these will require you
 *                to also pass VTIMEZONE (because they might refer to a TZID of the VCALENDAR).
 *                Alternatively, you can pass already normalized exdates/rdates.
 *
 *                However, this is not possible for the start date because recurrence time information is inherited
 *                from DTSTART if not defined otherwise (e.g. 9:30 start time means all recurrences will be 9:30 as well)
 *                This will be changed in a future version when moving to Temporals (@see https://github.com/filecage/ical-ts/issues/8)
 *
 *                A start date is required
 *                An end date is optional (iterator will continue indefinitely until it's no longer consumed)
 *
 *                Can be called with `null` VTIMEZONE to explicitly opt out of TZID conversions
 */
export default function *iterateReccurences (recur: Recur, options: { end?: Date }
        & {DTSTART: DateTime, VTIMEZONE: ICS.VTIMEZONE[]|null}
        & XOR<{EXDATE: DateTime[]}, {exdates?: Date[]}>
        & XOR<{RDATE: (DateTime|Period)[]}, {rdates?: Date[]}>
) : Generator<Date> {
    const start = getDateFromDateTime(options.DTSTART, options.VTIMEZONE ?? []);
    const end = options.end;
    let count = 0;
    
    for (const occurence of frequencyIterator(recur.frequency, recur.interval || 1, start, end)) {

        const dates: Date[] = [];
        if (recur.byDay !== undefined) {
            if (recur.frequency === RecurFrequency.Weekly) {
                const weekstart = recur.weekstart || RecurWeekday.Monday;
                const weekdayMap = reorderWeek(weekstart);
                const firstDayOfWeek = new Date(occurence);

                firstDayOfWeek.setDate(firstDayOfWeek.getDate() - (firstDayOfWeek.getDay() - WEEKDAYS.indexOf(weekstart) + 7) % 7);

                dates.push(...recur.byDay.map(byDay => {
                    const date = new Date(firstDayOfWeek);
                    date.setDate(date.getDate() + weekdayMap[byDay.weekday]);

                    return date;
                }));
            }
        }

        const targetDates = dates.length ? dates.sort((a, b) => a.getTime() - b.getTime()) : [occurence];

        for (const date of targetDates) {
            yield date;

            // Break out if we've exceeded the limit count
            if (recur.count && ++count >= recur.count) {
                return;
            }
        }
    }
}

type WeekdayMap = {[k in RecurWeekday]: number};
const WEEKDAYS = [
    RecurWeekday.Sunday,
    RecurWeekday.Monday,
    RecurWeekday.Tuesday,
    RecurWeekday.Wednesday,
    RecurWeekday.Thursday,
    RecurWeekday.Friday,
    RecurWeekday.Saturday,
];

function reorderWeek(weekstart: RecurWeekday): WeekdayMap {
    const startIndex = WEEKDAYS.indexOf(weekstart);
    const reorderedData: {[k in RecurWeekday]?: number} = {};

    WEEKDAYS.forEach((day: RecurWeekday, i) => {
        reorderedData[day] = (i - startIndex + 7) % 7;
    });

    return reorderedData as WeekdayMap;
}

function *frequencyIterator (frequency: RecurFrequency, interval: number, start: Date, end: Date|undefined) : Generator<Date> {
    let date = new Date(start);

    // The first date is always the starting date without any modifications
    yield new Date(date);

    // Little helper that ensures that we'll never iterate past MAX_SAFE_INTEGER if no end date is provided
    function *iterate (generate: () => number) {
        while (date <= (end || Number.MAX_SAFE_INTEGER)) {
            yield new Date(generate());
        }
    }

    switch (frequency) {
        case RecurFrequency.Yearly:
            const isFebruary29 = date.getMonth() === 1 && date.getDate() === 29;

            yield *iterate(() => {
                const nextYear = date.setFullYear(date.getFullYear() + interval);

                // February 29 gets an extra treatment: we're setting the date by ourselves to February 28 or February 29,
                // based on whether the target year is a leap year.
                // We can return early if the start date was not February 29
                if (!isFebruary29) {
                    return nextYear;
                }

                const nextIsLeapYear = date.getFullYear() % 4 === 0 && (
                    // Leap year is skipped if the year is divisible by 100, but not by 400
                    date.getFullYear() % 100 !== 0 || date.getFullYear() % 400 === 0
                );

                return date.setMonth(1, nextIsLeapYear ? 29 : 28);
            });
            break;

        case RecurFrequency.Monthly:
            const day = date.getDate();
            yield *iterate(() => {

                // Target day 0 moves the date back one month, meaning we need to add another one to the equation (hence the +1)
                const nextMonth = (new Date(date));
                nextMonth.setMonth(date.getMonth() + interval + 1, 0);

                return date.setUTCFullYear(nextMonth.getFullYear(), nextMonth.getMonth(), Math.min(day, nextMonth.getDate()));
            });
            break;

        case RecurFrequency.Weekly:
            yield *iterate(() => date.setDate(date.getDate() + interval * 7));
            break;

        case RecurFrequency.Daily:
            yield *iterate(() => date.setDate(date.getDate() + interval));
            break;

        case RecurFrequency.Hourly:
            yield *iterate(() => date.setTime(date.getTime() + interval * 3600000));
            break;

        case RecurFrequency.Minutely:
            yield *iterate(() => date.setTime(date.getTime() + interval * 60000));
            break;

        case RecurFrequency.Secondly:
            yield *iterate(() => date.setTime(date.getTime() + interval * 1000));
            break;

        default:
            throw new Error(`Unsupported recurrency frequency '${frequency}'`);
    }
}