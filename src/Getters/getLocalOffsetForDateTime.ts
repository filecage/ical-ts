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
}