import CalendarIterator from "../src/Parser/CalendarIterator";
import {readSample} from "./util/readSample";

// This test works with the invalid samples because they contain less stuff
// and valid calendar data doesn't matter for the iterator
describe('Calendar Buffer Tests', () => {
    it('Correctly streams key/value pairs for one layer', async () => {
        const buffer = await CalendarIterator.fromString(await readSample('invalids/invalid-version.ics'));
        const lines = [...buffer.iterate()];

        expect(lines).toEqual([
            {name: 'BEGIN', value: 'VCALENDAR'},
            {name: 'VERSION', value: '1.0'},
            {name: 'END', value: 'VCALENDAR'}
        ])
    })

    it('Should stop the iterator when a component reaches its END', async() => {
        const buffer = await CalendarIterator.fromString(await readSample('iterator/multiple-small-components.ics'));
        const firstIteration = [...buffer.iterate()];

        // Continue iteration and store to second array
        const secondIteration = [...buffer.iterate()];

        expect(firstIteration).toEqual([
            {name: 'BEGIN', value: 'VCALENDAR'},
            {name: 'VERSION', value: '2.0'},
            {name: 'PRODID', value: 'This test assures that the iterator stops once a component ENDs'},
            {name: 'BEGIN', value: 'VTIMEZONE'},
            {name: 'X-TEST', value: 'Hello yes'},
            {name: 'END', value: 'VTIMEZONE'},
        ]);

        expect(secondIteration).toEqual([
            {name: 'BEGIN', value: 'VTIMEZONE'},
            {name: 'X-TEST', value: 'I am a mess'},
            {name: 'END', value: 'VTIMEZONE'},
        ])
    });

    it('Should unfold the calendar data correctly', async () => {
        const buffer = await CalendarIterator.fromString(await readSample('iterator/folded-prodid.ics'));
        const lines = [...buffer.iterate()];

        expect(lines).toEqual([
            {name: 'BEGIN', value: 'VCALENDAR'},
            {name: 'PRODID', value: 'This is a very long prodid string that will be put into the next line and should still be valid'},
            {name: 'END', value: 'VCALENDAR'},
        ]);
    })
});