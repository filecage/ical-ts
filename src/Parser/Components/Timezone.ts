import Component, {Context} from "./Component";
import {ComponentName} from "./ComponentName";
import {ICS} from "../../ICS";
import TimezoneDaylight from "./TimezoneDaylight";
import TimezoneStandard from "./TimezoneStandard";

export default class Timezone extends Component<ICS.VTIMEZONE> {
    public readonly key = ComponentName.VTIMEZONE;

    constructor() {
        super([
            new TimezoneDaylight(),
            new TimezoneStandard()
        ])
    }

    build (context: Context) : ICS.VTIMEZONE {
        return {
            TZID: this.pickOrThrow(context, 'TZID'),
            ...this.pickNonStandardProperties(context),
            DAYLIGHT: this.pick(context, 'DAYLIGHT'),
            STANDARD: this.pick(context, 'STANDARD'),
        }
    }
}