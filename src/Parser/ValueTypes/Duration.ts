/** @see https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.6 */

export type Duration = {
    readonly inverted: boolean,
    readonly weeks?: number,
    readonly days?: number,
    readonly hours?: number,
    readonly minutes?: number,
    readonly seconds?: number,
};