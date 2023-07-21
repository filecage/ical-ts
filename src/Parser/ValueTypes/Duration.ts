/** @see https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.6 */
import {CAPITAL_T, HYPHEN_MINUS, PERIOD} from "../Constants";

export enum DurationDesignators {
    Weeks = 'W',
    Days = 'D',
    Hours = 'H',
    Minutes = 'M',
    Seconds = 'S',
}

export type Duration = {
    readonly inverted: boolean,
    readonly weeks?: number,
    readonly days?: number,
    readonly hours?: number,
    readonly minutes?: number,
    readonly seconds?: number,
};

export function formatDuration (duration: Duration) : string {
    const period: string[] = [];
    if (duration.weeks !== undefined) period.push(`${duration.weeks.toString()}${DurationDesignators.Weeks}`);
    if (duration.days !== undefined) period.push(`${duration.days.toString()}${DurationDesignators.Days}`);

    const timePeriod: string[] = [];
    if (duration.hours !== undefined) timePeriod.push(`${duration.hours.toString()}${DurationDesignators.Hours}`);
    if (duration.minutes !== undefined) timePeriod.push(`${duration.minutes.toString()}${DurationDesignators.Minutes}`);
    if (duration.seconds !== undefined) timePeriod.push(`${duration.seconds.toString()}${DurationDesignators.Seconds}`);

    if (timePeriod.length) {
        period.push(`${CAPITAL_T}${timePeriod.join('')}`);
    }

    if (period.length) {
        return `${duration.inverted ? HYPHEN_MINUS : ''}${PERIOD}${period.join('')}`;
    }

    return '';
}