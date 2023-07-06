import Property from "../Property";
import {Parameters} from "../../Parameters";
import {Duration} from "../ValueTypes/Duration";
import {UTCDateTime} from "../ValueTypes/DateTime";

export default class Trigger extends Property<Duration|UTCDateTime,
    Parameters.ValueDataTypes &
    Parameters.TimeZoneIdentifier &
    Parameters.AlarmTriggerRelationship
> {
    public readonly key = 'TRIGGER';
}