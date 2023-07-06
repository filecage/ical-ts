import Property from "../Property";
import {Parameters} from "../../Parameters";
import {DateTime} from "../ValueTypes/DateTime";

export default class DateTimeDue extends Property<DateTime,
    Parameters.ValueDataTypes & Parameters.TimeZoneIdentifier
> {
    public readonly key = 'DUE';
}