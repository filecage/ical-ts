import {ICS} from "../ICS";
import {DateTime, DateTimeClass} from "../Parser/ValueTypes/DateTime";
import getSecondsFromDuration from "./getSecondsFromDuration";

/**
 * Creates a `DateTime` value for the ending date/datetime of a given event
 *
 * If the event has a `DTEND` defined, this function just returns its DateTime
 * If the event has a `DURATION` defined, the duration is converted to seconds
 * and then added to the `DTSTART` date / datetime. All properties like UTC or
 * timezone identifier will be inherited from `DTSTART`.
 *
 * If neither `DTEND` not `DURATION` are defined, the function throws an `Error`.
 *
 * @param {ICS.VEVENT.Published} event
 * @return DateTime
 */
export function getEventEndDateTime (event: ICS.VEVENT.Published) : DateTime {
    if (event.DTEND !== undefined) {
        return event.DTEND.value;
    } else if (event.DURATION === undefined) {
        throw new Error(`Event must have either 'DTEND' or 'DURATION' property to get event end time`);
    }

    const {isUTC, timezoneIdentifier, date: startDate} = event.DTSTART.value;
    const endDate = new Date(startDate.getTime() + (getSecondsFromDuration(event.DURATION.value) * 1000));

    return new DateTimeClass(endDate, false, isUTC, timezoneIdentifier) as DateTime;
}