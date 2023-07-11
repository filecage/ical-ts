import Property from "./Property";
import {Parameters} from "../../Parameters";
import {DateTime} from "../ValueTypes/DateTime";

export default class RecurrenceID extends Property<DateTime,
    Parameters.ValueDataTypes &
    Parameters.TimeZoneIdentifier &
    Parameters.Range
> {
    public readonly key = 'RECURRENCE-ID';
}