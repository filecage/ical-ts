import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";
import {DateTime} from "../ValueTypes/DateTime";

export default class DateTimeStart extends Property<DateTime,
    Parameters.ValueDataTypes & Parameters.TimeZoneIdentifier
> {
    public readonly key = 'DTSTART';
}