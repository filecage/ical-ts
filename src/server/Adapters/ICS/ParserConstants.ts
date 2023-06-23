export const NEW_LINE = /\r\n|\n|\r/
export const SPACE = ' '
export const COLON = ':'
export const SEMICOLON = ';'
export const EQUAL = '='

export const BEGIN = 'BEGIN'
export const END = 'END';

export enum Components {
    VCALENDAR = 'VCALENDAR',
    VTIMEZONE = 'VTIMEZONE',
    VEVENT = 'VEVENT',
    VALARM = 'VALARM',
    TZONE_STANDARD = 'STANDARD',
    TZONE_DAYLIGHT = 'DAYLIGHT',
}