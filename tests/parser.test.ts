import {readSample} from "./util/readSample";
import {sortedJSONKeysReplacer} from "./util/sortedJSONKeysReplacer";
import {unfold} from "../src/Parser/unfold";
import {parseString} from "../src/parser";

describe('Parse ICS to JSON', () => {
    const samples = [
        'blank_description.ics',
        'blank_line_end.ics',
        'blank_line_mid.ics',
        'daily_recur.ics',
        'day_long_recur_yearly.ics',
        'duration_instead_of_dtend.ics',
        'forced_types.ics',
        'google_birthday.ics',
        'minimal.ics',
        'only_dtstart_date.ics',
        'only_dtstart_time.ics',
        'parserv2.ics',
        'recur_instances.ics',
        'recur_instances_finite.ics',
        'utc_negative_zero.ics'
    ];

    it.each(samples)('Parses ICS and matches JSON snapshot `%s`', async sample => {
        const sampleData = await readSample(sample);
        const ics = parseString(sampleData);
        const json = JSON.stringify(ics, sortedJSONKeysReplacer);
        expect(json).toMatchSnapshot();
    });
});

describe('Throw errors for invalid ICS files', () => {
    const invalidSamples: [string, string][] = [
        ['missing-vcalendar-properties.ics', "Missing mandatory key 'PRODID'"],
        ['missing-valarm-properties.ics', "Missing mandatory key 'TRIGGER'"],
        ['invalid-version.ics', "Invalid value '1.0' for property 'Version', must be one of: 2.0"],
        ['multiple-rrules.ics', "Non-list property 'RRULE' appeared twice in component 'VEVENT'"],
        ['missing-vtimezone-properties.ics', "Missing mandatory key 'TZID'"],
        ['invalid-component.ics', "Unexpected sub-component 'X-UNKNOWN' not allowed in component 'ROOT'"],
        ['invalid-end.ics', "Unexpected 'END:VCALENDAR' in component 'VEVENT'"],
        ['missing-end.ics', "Unexpected EOF: missing END declaration for component 'VCALENDAR'"],
    ]

    it.each(invalidSamples)(`Correctly throws for invalid sample '%s'`, async (sample, expectedErrorMessage) => {
        const sampleData = await readSample(`invalids/${sample}`);

        expect(() => parseString(sampleData)).toThrowError(expectedErrorMessage);
    });
});

describe('Unfold long ICS lines', () => {
    const lines = [
        'This is a very long line that is',
        '  wrapped according to RFC5545.',
        'This is a new line because it does not start with a space'
    ];

    it('should unfold to two lines according to RFC5545', () => {
        expect(unfold(lines)).toEqual([
            'This is a very long line that is wrapped according to RFC5545.',
            'This is a new line because it does not start with a space'
        ]);
    })
});

/**
 * RFC5545 states that line endings must be CRLF. However, we want to support all possible
 * line endings because there is no tradeoff. If ICS providers don't adhere to the standard,
 * we can still support them.
 */
describe('Line Endings', () => {
    it.each(["\r\n", "\n", "\r"])('Should parse %j line endings', EOL => {
        const calendars = parseString(`BEGIN:VCALENDAR${EOL}PRODID:Test${EOL}VERSION:2.0${EOL}END:VCALENDAR${EOL}`);
        expect(calendars.VCALENDAR).toHaveLength(1);
        expect(calendars.VCALENDAR[0].PRODID.value).toEqual('Test');
        expect(calendars.VCALENDAR[0].VERSION.value).toEqual('2.0');
    });
})