import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";
import {Duration} from "../ValueTypes/Duration";
import {UTCDateTime} from "../ValueTypes/DateTime";
import CustomValueParserFn from "./CustomValueParserFn";
import {parseUTCDateTimeOrDuration} from "../parseValues";

export default class Trigger extends Property<Duration|UTCDateTime,
    Parameters.ValueDataTypes &
    Parameters.AlarmTriggerRelationship
> implements CustomValueParserFn<typeof parseUTCDateTimeOrDuration>{
    public readonly key = 'TRIGGER';
}