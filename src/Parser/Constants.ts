export const NEW_LINE = /\r\n|\n|\r/
export const QUOTES = '"';
export const SPACE = ' '
export const COLON = ':'
export const SEMICOLON = ';'
export const EQUAL = '='
export const COMMA = ','
export const BEGIN = 'BEGIN'
export const END = 'END';
export const PERIOD = 'P';
export const CAPITAL_T = 'T';
export const CAPITAL_Z = 'Z';
export const SOLIDUS = '/';
export const HYPHEN_MINUS = '-';
export const PLUS = '+';

export enum Component {
    VCALENDAR = 'VCALENDAR',
    VTIMEZONE = 'VTIMEZONE',
    VEVENT = 'VEVENT',
    VALARM = 'VALARM',
    TZONE_STANDARD = 'STANDARD',
    TZONE_DAYLIGHT = 'DAYLIGHT',
}

export enum Property {
    ATTENDEE = 'ATTENDEE',
    RRULE = 'RRULE',
    RRDATE = 'RDATE',
    COMMENT = 'COMMENT',
    DESCRIPTION = 'DESCRIPTION',
    EXDATE = 'EXDATE',
}

// This defines components that will always be treated as a list (and put into an array when parsing)
// It does not include root components like VCALENDAR, VTTIMEZONE etc. pp.
export const LIST_PROPERTIES: Property[] = [
    Property.ATTENDEE,
    Property.RRDATE,
    Property.COMMENT,
    Property.DESCRIPTION,
    Property.EXDATE,
];