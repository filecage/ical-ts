import Property from "../Property";
import {Parameters} from "../../Parameters";
import {DateTime} from "../ValueTypes/DateTime";
import {Period} from "../ValueTypes/Period";

export default class RecurrenceDateTimes extends Property<(DateTime|Period)[],
    Parameters.ValueDataTypes &
    Parameters.TimeZoneIdentifier
> {
    public readonly key = 'RDATE';

    toString(): string {
        return this.value.toString();
    }
}