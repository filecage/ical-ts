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

    it('Should correctly split fragments with escaped quoted value', () => {
        const fragments = parseFragments(`FOO="Hello; I am \"foobar\"";BAR=BAZ`);

        expect(fragments).toEqual([
            `FOO="Hello; I am "foobar""`,
            `BAR=BAZ`
        ]);
    });

    it('Should correctly split fragments with escaped semicolon value', () => {
        const fragments = parseFragments('FOO=Hello\\; I am foobar;BAR=BAZ');

        expect(fragments).toEqual([
            `FOO=Hello; I am foobar`,
            `BAR=BAZ`
        ]);
    });
})