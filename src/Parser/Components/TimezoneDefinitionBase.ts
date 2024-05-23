import Component, {Context} from "./Component";
import {ICS} from "../../ICS";
import RecurrenceRule from "../Properties/RecurrenceRule";
import RecurrenceDateTimes from "../Properties/RecurrenceDateTimes";

export default abstract class TimezoneDefinitionBase extends Component<ICS.TimezoneDefinition> {

    constructor() {
        super([]);
    }

    build (context: Context) : ICS.TimezoneDefinition {
        return {
            TZOFFSETFROM: this.pickOrThrow(context, 'TZOFFSETFROM'),
            TZOFFSETTO: this.pickOrThrow(context, 'TZOFFSETTO'),
            TZNAME: this.pick(context, 'TZNAME'),
            DTSTART: this.pickOrThrow(context, 'DTSTART'),
            ...this.pickNonStandardProperties(context),
            ...this.pickRRuleOrRdate(context),
        };
    }

    private pickRRuleOrRdate (data: {[key: string]: unknown}) : undefined | {RRULE: RecurrenceRule} | {RDATE: RecurrenceDateTimes[]} {
        const RRULE = this.pick<RecurrenceRule>(data, 'RRULE');
        if (RRULE !== undefined) {
            return {RRULE};
        }

        const RDATE = this.pick<RecurrenceDateTimes[]>(data, 'RDATE');
        if (RDATE !== undefined) {
            return {RDATE};
        }

        return undefined;
    }
}