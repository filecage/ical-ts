import Component, {Context} from "./Component";
import {ICS} from "../../ICS";
import {ComponentName} from "./ComponentName";
import {XOR} from "ts-xor";
import Duration from "../Properties/Duration";
import DateTimeEnd from "../Properties/DateTimeEnd";
import Alarm from "./Alarm";

export default class Event extends Component<ICS.VEVENT.Published> {
    public readonly key = ComponentName.VEVENT;

    constructor() {
        super([
            new Alarm()
        ]);
    }

    protected build(context: Context) : ICS.VEVENT.Published {
        return {
            DTSTAMP: this.pickOrThrow(context, 'DTSTAMP'),
            DTSTART: this.pickOrThrow(context, 'DTSTART'),
            ...this.pickDurationOrDateTimeEnd(context),
            UID: this.pickOrThrow(context, 'UID'),
            CREATED: this.pick(context, 'CREATED'),
            DESCRIPTION: this.pick(context, 'DESCRIPTION'),
            'LAST-MODIFIED': this.pick(context, 'LAST-MODIFIED'),
            'RECURRENCE-ID': this.pick(context, 'RECURRENCE-ID'),
            LOCATION: this.pick(context, 'LOCATION'),
            SEQUENCE: this.pick(context, 'SEQUENCE'),
            STATUS: this.pick(context, 'STATUS'),
            SUMMARY: this.pickOrThrow(context, 'SUMMARY'),
            TRANSP: this.pick(context, 'TRANSP'),
            VALARM: this.pick(context, 'VALARM'),
            CLASS: this.pick(context, 'CLASS'),
            COMMENT: this.pick(context, 'COMMENT'),
            ORGANIZER: this.pick(context, 'ORGANIZER'),
            RRULE: this.pick(context, 'RRULE'),
            RDATE: this.pick(context, 'RDATE'),
            EXDATE: this.pick(context, 'EXDATE'),
            ATTENDEE: this.pick(context, 'ATTENDEE'),
            ...this.pickNonStandardProperties(context),
        };
    }

    private pickDurationOrDateTimeEnd (data: {[key: string]: unknown}) : undefined|XOR<{DURATION: Duration}, {DTEND: DateTimeEnd}> {
        const DTEND = this.pick<DateTimeEnd>(data, 'DTEND');
        if (DTEND !== undefined) {
            return {DTEND};
        }

        const DURATION = this.pick<Duration>(data, 'DURATION');
        if (DURATION !== undefined) {
            return {DURATION};
        }

        return undefined;
    }

}