import {Duration} from "../Parser/ValueTypes/Duration";

/**
 * Returns the number of seconds from a given `Duration` object
 *
 * @param {Duration} duration
 * @return number
 */
export default function getSecondsFromDuration (duration: Duration) : number {
    return (
        (duration.seconds || 0)
        + ((duration.minutes || 0) * 60)
        + ((duration.hours || 0) * 3600)
        + ((duration.days || 0) * 86400)
        + ((duration.weeks || 0) * 604800)
    ) * (duration.inverted ? -1 : 1);
}