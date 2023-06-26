
import {lines2tree} from "icalts";
import ICSParser from "../src/server/Adapters/ICS/ICSParser";
import {readSample} from "./util/readSample";
import {sortedJSONKeysReplacer} from "./util/sortedJSONKeysReplacer";


describe('Parse ICS to JSON file', () => {
    const parser = new ICSParser();
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
        const ics = parser.parseFromStringToJSON(sampleData);
        const json = JSON.stringify(ics, sortedJSONKeysReplacer);
        expect(json).toMatchSnapshot();
    });

    const invalidSamples: [string, string][] = [
        ['missing-vcalendar-properties.ics', "Missing mandatory key 'VERSION'"],
        ['missing-valarm-properties.ics', "Missing mandatory key 'TRIGGER'"],
        ['invalid-version.ics', "Parser only supports version 2.0"],
        ['multiple-rrules.ics', "Non-list component 'RRULE' appeared twice"],
    ]

    it.each(invalidSamples)(`Correctly throws for invalid sample '%s'`, async (sample, expectedErrorMessage) => {
        const sampleData = await readSample(`invalids/${sample}`);

        expect(() => parser.parseFromStringToJSON(sampleData)).toThrowError(expectedErrorMessage);
    });
});

describe('Unfold long ICS lines', () => {
    const parser = new ICSParser();
    const lines = [
        'This is a very long line that is',
        '  wrapped according to RFC5545.',
        'This is a new line because it does not start with a space'
    ];

    it('should unfold to two lines according to RFC5545', () => {
        expect(parser.unfold(lines)).toEqual([
            'This is a very long line that is wrapped according to RFC5545.',
            'This is a new line because it does not start with a space'
        ]);
    })
})