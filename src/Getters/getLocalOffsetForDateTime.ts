import {ICS} from "../ICS";
import {Offset} from "../Parser/ValueTypes/Offset";
import {DateTime} from "../Parser/ValueTypes/DateTime";
import formatOffset from "../Formatters/formatOffset";
import iterateReccurences from "./iterateReccurences";
import TimezoneDefinition = ICS.TimezoneDefinition;

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

    const timezoneCandidates = [
        getTimezoneCandidate(dateTime, timezone.STANDARD),
        getTimezoneCandidate(dateTime, timezone.DAYLIGHT),
    ].filter(tz => tz !== undefined);

    // Extend each timezone candidate's RRULE to get the latest transition times
    const timezoneCandidatesTransitions = timezoneCandidates.map(timezoneDefinition => {
        if (timezoneDefinition.RDATE) {
            // TODO: ICS definition only allows RDATE *or* RRULE, but is this really in the RFC?
            throw new Error(`Missing support for RDATE in VTIMEZONE timezone definition`);
        }

        let lastTransition = timezoneDefinition?.DTSTART.value.date;
        if (timezoneDefinition.RRULE) {
            for (const thisTransition of iterateReccurences(timezoneDefinition.RRULE.value, {DTSTART: timezoneDefinition.DTSTART.value, VTIMEZONE: null})) {
                if (thisTransition > dateTime.date) {
                    break;
                }

                lastTransition = thisTransition;
            }
        }

        return {timezoneDefinition, transition: lastTransition};
    });

    const activeTimezone = timezoneCandidatesTransitions
        .sort((a, b) => b.transition?.getTime() - a.transition?.getTime())
        .at(0)?.timezoneDefinition;

    if (activeTimezone === undefined) {
        throw new Error(
            `Missing timezone definition for needle TZID '${dateTime.timezoneIdentifier}': None of the provided definitions was applicable. ` +
            `This is either a standard violation or a bug in the ical-ts library.`
        );
    }

    // Calculate an offset between the local offset of the Date (local node's timezone)
    // and then add the calendar's timezone offset. This is the difference between the candidate dateTime
    // and the actually stored datetime, so the offset seconds are the negative of the VTIMEZONE with the
    // local node timezone offset added again
    const offsetSeconds = (activeTimezone.TZOFFSETTO.value.seconds * -1)
        + dateTime.date.getTimezoneOffset()
        * -60 // `getTimezoneOffset` returns a flipped value, so we flip it back here
    ;

    return {
        toString: () => formatOffset(offsetSeconds),
        seconds: offsetSeconds,
    };
}

function getTimezoneCandidate (at: DateTime, timezones: undefined|TimezoneDefinition[]) : undefined|TimezoneDefinition {
    if (timezones === undefined) {
        return undefined;
    }

    return timezones.reduce((timezoneCandidate: undefined|TimezoneDefinition, timezoneDefinition) => {
        // const timezoneStartsAtUTC = timezoneDefinition.DTSTART.value.date.getTime() + timezoneDefinition.TZOFFSETFROM.value.seconds * 1000;
        // Select the timezone definition with the closest DTSTART to our `at`
        if (timezoneDefinition.DTSTART.value.date <= at.date && (timezoneCandidate === undefined || timezoneCandidate.DTSTART.value.date < timezoneDefinition.DTSTART.value.date)) {
            return timezoneDefinition;
        }

        return timezoneCandidate;
    }, undefined);
}