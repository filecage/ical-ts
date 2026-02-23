import {ICS} from "../ICS";
import {Offset} from "../Parser/ValueTypes/Offset";
import {DateTime} from "../Parser/ValueTypes/DateTime";

/**
 * Takes a `dateTime` and a list of calendar `VTIMEZONE` definitions and returns the offset that needs
 * to be applied to the datetime.
 *
 * @param dateTime
 * @param timezones
 */
export default function getLocalOffsetForDateTime (dateTime: DateTime, timezones: ICS.VTIMEZONE[]) : Offset {
    // UTC times and floating times need no offset
    // Floating times would technically require an offset, but JavaScript's `Date` implementation already does that
    // @see https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.5
    // @todo When switching to `Temporal`, this needs to be reworked
    if (dateTime.isUTC || dateTime.timezoneIdentifier === undefined) {
        return {toString: () => '+0000', seconds: 0};
    }

    const timezone = timezones.find(timezone => timezone.TZID.value === dateTime.timezoneIdentifier);
    if (timezone === undefined) {
        throw new Error(`Missing timezone definition for needle TZID '${dateTime.timezoneIdentifier}'`);
    }
}