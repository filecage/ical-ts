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
        // The context always keeps the current dates and their scope
        // If, for instance, the scope is yearly, each date does not refer to a specific day, but just to the year
        // If it's monthly, the dates refer to a month and so on and so forth
        // For performance purpose, the order of dates must always be kept from earliest to latest (so we can always easily select them)
        let context: RecurrenceContext = {
            scope: recur.frequency,
            dates: [entryDate],
        };

        if (recur.byMonth !== undefined) {
            // BYMONTH expands for YEARLY and limits for everything else
            if (recur.frequency === RecurFrequency.Yearly) {
                context = {
                    scope: RecurFrequency.Monthly,
                    dates: recur.byMonth.map(month => {
                        const nextMonth = new Date(entryDate);

                        return new Date(nextMonth.setMonth(month - 1));
                    })
                }
            } else {
                // TODO: Implement
                throw new Error(`Missing support for RRULE.BYMONTH with FREQ=${recur.frequency}`);
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
            switch (recur.frequency) {
                case RecurFrequency.Monthly:
                case RecurFrequency.Yearly:
                    context = {
                        scope: RecurFrequency.Daily,
                        dates: context.dates.flatMap(contextDate => recur.byMonthday!.map(monthday => {
                            const monthdayDate = new Date(contextDate);
                            const targetMonth = monthdayDate.getMonth();

                            // Negative offsets mean we first have to move to the first day of the last month,
                            // then apply the offset to move back.
                            if  (monthday < 1) {
                                // Cancel the effect of a 0-offset here (not allowed by RFC)
                                // then adjust +1 so -1 (RFC for "last day") == 0 (`Date()` for "last day")
                                monthdayDate.setMonth(monthdayDate.getMonth() + 1, Math.min(monthday, -1) + 1);
                            } else {
                                monthdayDate.setDate(monthday);
                            }

                            // Whenever the offset led to a new month, this means the date is invalid
                            // and needs to be filtered
                            if (monthdayDate.getMonth() !== targetMonth) {
                                return undefined;
                            }

                            return monthdayDate;
                        }).filter(date => date !== undefined))
                    }
                    break;

                default:
                    // TODO: Implement
                    throw new Error(`Missing support for RRULE.BYMONTHDAY with FREQ=${recur.frequency}`);
            }
        }

        if (recur.byDay !== undefined) {
            switch (recur.frequency) {
                case RecurFrequency.Weekly:
                    const weekstart = recur.weekstart || RecurWeekday.Monday;
                    const weekdayMap = reorderWeek(weekstart);
                    const firstDayOfWeek = new Date(entryDate);

                    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - (firstDayOfWeek.getDay() - WEEKDAYS.indexOf(weekstart) + 7) % 7);

                    context = {
                        scope: RecurFrequency.Daily,
                        dates: recur.byDay.map(byDay => {
                            const date = new Date(firstDayOfWeek);
                            date.setDate(date.getDate() + weekdayMap[byDay.weekday]);

                            return date;
                        }).sort((a, b) => a.getTime() - b.getTime())
                    };

                    break;

                case RecurFrequency.Monthly:
                case RecurFrequency.Yearly:
                    if (recur.byMonthday || recur.byYearday) {
                        // TODO: Limit if BYMONTHDAY or or BYYEARDAY is present
                        throw new Error(`Missing support for RRULE.BYDAY with FREQ=${recur.frequency} in combination with RRULE.BYMONTHDAY or RRULE.BYYEARDAY`);
                    } else {
                        // Consolidate all weekday filters, so we can create the required indices in one batch
                        const weekdayFilters = recur.byDay.reduce((filters, filter) => {
                            if (!filters[filter.weekday]) {
                                filters[filter.weekday] = [];
                            }

                            filters[filter.weekday].push(filter);

                            return filters;
                        }, {} as {[k in RecurWeekday]: RecurByWeekday[]});

                        const earliest = earliestDateInContext(context);
                        const latest = latestDateInContext(context);

                        const dates = (Object.entries(weekdayFilters) as [RecurWeekday, RecurByWeekday[]][]).flatMap(([weekday, byDays]) => {
                            // For each needle weekday, we generate all occurrences within the earliest/latest timeframe
                            // We do this by selecting the very first occurrence of this weekday and then adding 7 days until we've exceeded the latest date
                            // After this we select the correct indices from the generated stack
                            const weekdayIndex = WEEKDAYS.indexOf(weekday);
                            const nextWeekday = new Date(earliest);
                            if (nextWeekday.getDay() !== weekdayIndex) {
                                nextWeekday.setDate(nextWeekday.getDate() + (weekdayIndex - nextWeekday.getDay() + 7) % 7);
                            }

                            const offsets = byDays.map(byDay => byDay.offset * (byDay.modifier === RecurModifier.Minus ? -1 : 1));
                            const candidates: Date[] = [];
                            while (nextWeekday <= latest) {
                                candidates.push(new Date(nextWeekday));
                                nextWeekday.setDate(nextWeekday.getDate() + 7);
                            }

                            // If there is offset 0 in BYDAY filter, it means no offset given, which effectively means "every occurrence"
                            if (offsets.includes(0)) {
                                return candidates;
                            }

                            // Correct offset to 0-indexed if it's not negative
                            return offsets.map(offset => candidates.at(offset < 0 ? offset : offset - 1))
                                .filter(candidate => candidate !== undefined);
                        }).sort((a, b) => a.getTime() - b.getTime());

                        context = {scope: RecurFrequency.Daily, dates};
                    }
                    break;

                default:
                    throw new Error(`Missing support for RRULE.BYDAY with FREQ=${recur.frequency}`);
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
            const includedIndices = recur.bySetPos.map(index => index > 0
                ? index - 1 // adjust for zero-based index
                : context.dates.length + index // calculate index access based on result set length
            );

            context.dates = context.dates.filter((_, index) => includedIndices.includes(index));
        }

        for (const date of context.dates) {
            // Skip if the date is too early
            if (date < start) {
                continue;
            }

            // Break out if we've exceeded the limit date
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

type RecurrenceContext = {
    scope: RecurFrequency
    dates: Date[],
};

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

function earliestDateInContext (context: RecurrenceContext) : Date {
    if (!context.dates.length) {
        throw new Error(`Can not find earliest date: RecurrenceContext is empty`);
    }

    const earliest = new Date(context.dates.at(0)!);

    // Reset the date's properties to whatever is the earliest for the defined scope
    switch (context.scope) {
        case RecurFrequency.Yearly:
            return new Date(earliest.getFullYear(), 0, 1, 0, 0, 0, 0);

        case RecurFrequency.Monthly:
            return new Date(earliest.getFullYear(), earliest.getMonth(), 1, 0, 0, 0, 0);

        case RecurFrequency.Weekly:
            // TODO: Does this require the first day of the week or the first week of the year?
            break;

        case RecurFrequency.Daily:
            return new Date(earliest.getFullYear(), earliest.getMonth(), earliest.getDate(), 0, 0, 0, 0);

        case RecurFrequency.Hourly:
            return new Date(earliest.getFullYear(), earliest.getMonth(), earliest.getDate(), earliest.getHours(), 0, 0, 0);

        case RecurFrequency.Minutely:
            return new Date(earliest.getFullYear(), earliest.getMonth(), earliest.getDate(), earliest.getHours(), earliest.getMinutes(), 0, 0);

        case RecurFrequency.Secondly:
            return earliest;
    }

    throw new Error(`Can not find earliest date: unsupported scope '${context.scope}' in RecurrenceContext. This is most likely a bug in ical-ts.`);
}

function latestDateInContext (context: RecurrenceContext) : Date {
    if (!context.dates) {
        throw new Error(`Can not find earliest date: RecurrenceContext is empty`);
    }

    const latest = new Date(context.dates.at(-1)!);

    // Reset the date's properties to whatever is the latest for the defined scope
    switch (context.scope) {
        case RecurFrequency.Yearly:
            return new Date(latest.getFullYear(), 12, 31, 23, 59, 59, 0);

        case RecurFrequency.Monthly:
            return new Date(latest.getFullYear(), latest.getMonth() + 1, 0, 23, 59, 59, 0);

        case RecurFrequency.Weekly:
            // TODO: Does this require the first day of the week or the first week of the year?
            break;

        case RecurFrequency.Daily:
            return new Date(latest.getFullYear(), latest.getMonth(), latest.getDate(), 23, 59, 59, 0);

        case RecurFrequency.Hourly:
            return new Date(latest.getFullYear(), latest.getMonth(), latest.getDate(), latest.getHours(), 59, 59, 0);

        case RecurFrequency.Minutely:
            return new Date(latest.getFullYear(), latest.getMonth(), latest.getDate(), latest.getHours(), latest.getMinutes(), 59, 0);

        case RecurFrequency.Secondly:
            return latest;
    }

    throw new Error(`Can not find earliest date: unsupported scope '${context.scope}' in RecurrenceContext. This is most likely a bug in ical-ts.`);
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