import Component, {Context} from "./Component";
import {ComponentName} from "./ComponentName";
import {ICS} from "../../ICS";

export default class Alarm extends Component<ICS.VALARM> {
    public readonly key = ComponentName.VALARM;

    constructor() {
        super([]);
    }

    build (context: Context) : ICS.VALARM {
        return {
            ...this.pickNonStandardProperties(context),
            ACTION: this.pickOrThrow(context, 'ACTION'),
            DESCRIPTION: this.pick(context, 'DESCRIPTION'),
            SUMMARY: this.pick(context, 'SUMMARY'),
            ATTENDEE: this.pick(context, 'ATTENDEE'),
            TRIGGER: this.pickOrThrow(context, 'TRIGGER'),
        };
    }
}