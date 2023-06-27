export const NEW_LINE = /\r\n|\n|\r/
export const SPACE = ' '
export const COLON = ':'
export const SEMICOLON = ';'
export const EQUAL = '='

export const BEGIN = 'BEGIN'
export const END = 'END';

export enum Component {
    VCALENDAR = 'VCALENDAR',
    VTIMEZONE = 'VTIMEZONE',
    VEVENT = 'VEVENT',
    VALARM = 'VALARM',
}

export enum Property {
    TZONE_STANDARD = 'STANDARD',
    TZONE_DAYLIGHT = 'DAYLIGHT',
    ATTENDEE = 'ATTENDEE',
    RRULE = 'RRULE',
    RRDATE = 'RDATE',
    COMMENT = 'COMMENT',
    EXDATE = 'EXDATE',
}

// This defines components that will always be treated as a list (and put into an array when parsing)
// It does not include root components like VCALENDAR, VTTIMEZONE etc. pp.
export const LIST_PROPERTIES: Property[] = [
    Property.ATTENDEE,
    Property.RRDATE,
    Property.COMMENT,
    Property.EXDATE,
];