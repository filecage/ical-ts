import {DateTime} from "../Parser/ValueTypes/DateTime";
import {ICS} from "../ICS";
import getLocalOffsetForDateTime from "./getLocalOffsetForDateTime";

/**
 * Takes a `DateTime` from the calendar and applies the defined offset
 * @param {DateTime} dateTime Subject date time
 * @param {VTIMEZONE[]} calendarTimezones All timezones defined by the calendar
 *
 * @return Date A date in the local process timezone, with the correct calendar timezone offset applied
 * @throws Error if `dateTime` references a timezone identifier that is not present in the `calendarTimezones`
 */
export function getDateFromDateTime (dateTime: DateTime, calendarTimezones: ICS.VTIMEZONE[]) : Date {
    const offset = getLocalOffsetForDateTime(dateTime, calendarTimezones);

    return new Date(dateTime.date.getTime() + offset.seconds * 1000);
}