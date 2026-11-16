import {parseFragments} from "../src/Parser/parseFragments";

describe('Parameter Encoding', () => {
    it('Should correctly split parameters fragments with quoted semicolon value', () => {
        const fragments = parseFragments(`ATTENDEE;CN=Carol Attendee;ROLE=OPT-PARTICIPANT;PARTSTAT=ACCEPTED;SCHEDULE-AGENT=SERVER;SCHEDULE-FORCE-SEND=REPLY;SCHEDULE-STATUS="2.0;Success"`);

        expect(fragments).toEqual([
            'ATTENDEE',
            'CN=Carol Attendee',
            'ROLE=OPT-PARTICIPANT',
            'PARTSTAT=ACCEPTED',
            'SCHEDULE-AGENT=SERVER',
            'SCHEDULE-FORCE-SEND=REPLY',
            'SCHEDULE-STATUS="2.0;Success"',
        ]);
    });

    it('Should preserve RFC6868 encoded quotes when splitting fragments', () => {
        const fragments = parseFragments(`FOO="a; ^'b^'";BAR=BAZ`);

        expect(fragments).toEqual([
            `FOO="a; ^'b^'"`,
            `BAR=BAZ`
        ]);
    });

    it('Should not treat backslashes as escaping semicolons', () => {
        const fragments = parseFragments('FOO=a\\;BAR=BAZ');

        expect(fragments).toEqual([
            'FOO=a\\',
            `BAR=BAZ`
        ]);
    });

    it('Should not treat backslashes as escaping closing quotes', () => {
        const fragments = parseFragments('FOO="a\\";BAR=BAZ');

        expect(fragments).toEqual(['FOO="a\\"', 'BAR=BAZ']);
    });

    it('Should preserve backslashes inside quoted values', () => {
        const fragments = parseFragments('FOO="a\\;b";BAR=BAZ');

        expect(fragments).toEqual(['FOO="a\\;b"', 'BAR=BAZ']);
    });

})
