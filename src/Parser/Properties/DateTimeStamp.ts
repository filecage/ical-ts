import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";
import {UTCDateTime} from "../ValueTypes/DateTime";

export default class DateTimeStamp extends Property<UTCDateTime> {
    public readonly key = 'DTSTAMP';
}