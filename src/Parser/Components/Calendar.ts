import Component, {Context} from "./Component";
import {ICS} from "../../ICS";
import {ComponentName} from "./ComponentName";
import Timezone from "./Timezone";
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
            ...this.pickNonStandardProperties(context),
            PRODID: this.pickOrThrow(context, 'PRODID'),
            VERSION: this.pickOrThrow(context, 'VERSION'),
            CALSCALE: this.pick(context, 'CALSCALE'),
            COMMENT: this.pick(context, 'COMMENT'),
            VTIMEZONE: this.pick<ICS.VTIMEZONE[]>(context, ComponentName.VTIMEZONE),
            VEVENT: this.pick<ICS.VEVENT.Published[]>(context, ComponentName.VEVENT),
        } as ICS.VCALENDAR;
    }

}