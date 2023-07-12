import Component, {Context} from "./Component";
import {ICS} from "../../ICS";
import {ComponentName} from "./ComponentName";
import Timezone from "./Timezone";
import Alarm from "./Alarm";
import Event from "./Event";

export default class Calendar extends Component<ICS.VCALENDAR> {
    public readonly key = ComponentName.VCALENDAR;

    constructor() {
        super([
            new Event,
            new Timezone,
        ]);
    }


    protected build(context: Context) : ICS.VCALENDAR {
        return {
            PRODID: this.pickOrThrow(context, 'PRODID'),
            VERSION: this.pickOrThrow(context, 'VERSION'),
            CALSCALE: this.pick(context, 'CALSCALE'),
            COMMENT: this.pick(context, 'COMMENT'),
            ...this.pickNonStandardProperties(context),
            VTIMEZONE: this.pick<ICS.VTIMEZONE[]>(context, ComponentName.VTIMEZONE),
            VEVENT: this.pick<ICS.VEVENT.Published[]>(context, ComponentName.VEVENT),
        }
    }

}