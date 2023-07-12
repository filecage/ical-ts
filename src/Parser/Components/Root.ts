import Component, {Context} from "./Component";
import {ICS} from "../../ICS";
import {ComponentName} from "./ComponentName";
import Calendar from "./Calendar";

export default class Root extends Component<{VCALENDAR: ICS.VCALENDAR[]}> {
    public readonly key = ComponentName.ROOT;

    constructor() {
        super([
            new Calendar()
        ]);
    }

    protected build(context: Context): { VCALENDAR: ICS.VCALENDAR[] } {
        return {VCALENDAR: this.pick(context, ComponentName.VCALENDAR) || []};
    }

}