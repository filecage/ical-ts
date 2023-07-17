import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";
import {DateTime} from "../ValueTypes/DateTime";
import {Period} from "../ValueTypes/Period";
import CustomValueParserFn from "./CustomValueParserFn";
import {parseDateTimeOrPeriod} from "../parseValues";

// TODO: Implement parser
export default class RecurrenceDateTimes extends Property<(DateTime|Period)[],
    Parameters.ValueDataTypes &
    Parameters.TimeZoneIdentifier
> implements CustomValueParserFn<typeof parseDateTimeOrPeriod>{
    public readonly key = 'RDATE';

    toString(): string {
        return this.value.toString();
    }
}