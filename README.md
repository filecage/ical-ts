# @filecage/ical
This is a library to parse and read iCalendar files (.ics, .ical). Unlike other solutions, it is fully
typed and thus provides a pleasant type hinting experience. It was built along the RFC standard definitions
and validates raw input while parsing.

It normalizes values where possible (e.g. possible list values are always accessed as array),
but it does not interpret values (like RRULE or timezone references) apart from the value encoding
defined in RFC 5545 and RFC 6868.

> [!NOTICE]
> This is a very early development release. The interface is still experimental and many things might not yet
> work as expected.

**Install via npm**
```bash
npm i --save @filecage/ical
```
> [!WARNING]
> RFC compliance and validation strictness in development versions are not guaranteed.
> Anything can change at any time until release 1.x.

## Why?
There are several existing parsers for iCalendar/ICS formats, but none of them met my expectations in neither
the interface, the level of provided types nor RFC standard compliance.

## Usage
### Parsers
Two different functions exist to parse your calendar:
#### By File
```js
import {parseFile} from '@filecage/ical/parse';

const calendar = await parseFile('my-calendar.ics');
```

#### By String
```js
import {parseString} from '@filecage/ical/parse';

const calendar = await parseString(`
BEGIN:VCALENDAR
PRODID:MyCalendar
VERSION:2.0
END:VCALENDAR
`);
```
