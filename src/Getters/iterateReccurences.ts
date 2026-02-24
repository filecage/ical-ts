import {XOR} from "ts-xor";
import {Recur, RecurByWeekday, RecurFrequency, RecurModifier, RecurWeekday} from "../Parser/ValueTypes/Recur";
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
 *                If `options.end` is provided and the RRULE has an `UNTIL`, the earlier of the two will be chosen as end date
 *
 *                Can be called with `null` VTIMEZONE to explicitly opt out of TZID conversions
 */
export default function *iterateReccurences (recur: Recur, options: { end?: Date }
        & {DTSTART: DateTime, VTIMEZONE: ICS.VTIMEZONE[]|null}
        & XOR<{EXDATE: DateTime[]}, {exdates?: Date[]}>
        & XOR<{RDATE: (DateTime|Period)[]}, {rdates?: Date[]}>
) : Generator<Date> {
    const start = getDateFromDateTime(options.DTSTART, options.VTIMEZONE ?? []);
    const until = recur.until ? getDateFromDateTime(recur.until, options.VTIMEZONE ?? []) : undefined;
    const end = (options.end && until) ? new Date(Math.min(until.getTime(), options.end.getTime())) : (options.end || until);
    let count = 0;

    for (const entryDate of frequencyIterator(recur.frequency, recur.interval || 1, start, end)) {
        let occurences: Date[] = [];

        if (recur.byMonth !== undefined) {
            // BYMONTH expands for YEARLY and limits for everything else
            if (recur.frequency === RecurFrequency.Yearly) {
                for (const month of recur.byMonth) {
                    const nextDayInMonth = new Date(entryDate.getFullYear(), month - 1, 1, entryDate.getHours(), entryDate.getMinutes(), entryDate.getSeconds(), entryDate.getMilliseconds());

                    while (nextDayInMonth.getMonth() === month - 1) {
                        occurences.push(new Date(nextDayInMonth));
                        nextDayInMonth.setDate(nextDayInMonth.getDate() + 1);
                    }
                }
            }
        }

        if (recur.byWeekNo) {
            // TODO: Implement
            throw new Error("Missing support for RRULE.BYWEEKNO");
        }

        if (recur.byYearday) {
            // TODO: Implement
            throw new Error("Missing support for RRULE.BYYEARDAY");
        }

        if (recur.byMonthday) {
            // TODO: Implement
            throw new Error("Missing support for RRULE.BYMONTHDAY");
        }

        if (recur.byDay !== undefined) {
            switch (recur.frequency) {
                case RecurFrequency.Weekly:
                    const weekstart = recur.weekstart || RecurWeekday.Monday;
                    const weekdayMap = reorderWeek(weekstart);
                    const firstDayOfWeek = new Date(entryDate);

                    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - (firstDayOfWeek.getDay() - WEEKDAYS.indexOf(weekstart) + 7) % 7);

                    occurences.push(...recur.byDay.map(byDay => {
                        const date = new Date(firstDayOfWeek);
                        date.setDate(date.getDate() + weekdayMap[byDay.weekday]);

                        return date;
                    }));
                    break;

                case RecurFrequency.Yearly:
                    if (recur.byMonthday || recur.byYearday) {
                        // TODO: Limit if BYMONTHDAY or or BYYEARDAY is present
                    } else {
                        // Consolidate all weekday filters, so we can select the required indices in one batch
                        const weekdayFilters = recur.byDay.reduce((filters, filter) => {
                            if (!filters[filter.weekday]) {
                                filters[filter.weekday] = [];
                            }

                            filters[filter.weekday].push(filter);

                            return filters;
                        }, {} as {[k in RecurWeekday]: RecurByWeekday[]});

                        occurences = (Object.entries(weekdayFilters) as [RecurWeekday, RecurByWeekday[]][]).flatMap(([weekday, byDays]) => {
                            const weekdayIndex = WEEKDAYS.indexOf(weekday);
                            const offsets = byDays.map(byDay => byDay.offset * (byDay.modifier === RecurModifier.Minus ? -1 : 1));
                            const candidates = occurences.filter(date => date.getDay() === weekdayIndex);

                            // Correct offset to 0-indexed if it's not negative
                            return offsets.map(offset => candidates.at(offset < 0 ? offset : offset - 1))
                                .filter(candidate => candidate !== undefined);
                        });
                    }
                    break;
            }
        }

        if (recur.byHour) {
            // TODO: Implement
            throw new Error("Missing support for RRULE.BYHOUR");
        }

        if (recur.byMinute) {
            // TODO: Implement
            throw new Error("Missing support for RRULE.BYMINUTE");
        }

        if (recur.bySecond) {
            // TODO: Implement
            throw new Error("Missing support for RRULE.BYSECOND");
        }

        if (recur.bySetPos) {
            // TODO: Implement
            throw new Error("Missing support for RRULE.BYSETPOS");
        }

        const targetDates = occurences.length ? occurences.sort((a, b) => a.getTime() - b.getTime()) : [entryDate];

        for (const date of targetDates) {
            // Skip if the date is too early
            if (date < start) {
                continue;
            }

            // Break out if we've exceeded the limit date before yielding
            if (end && date >= end) {
                return;
            }

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