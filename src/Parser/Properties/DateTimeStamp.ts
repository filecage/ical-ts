import Property from "./Property";
import {UTCDateTime} from "../ValueTypes/DateTime";

export default class DateTimeStamp extends Property<UTCDateTime> {
    public readonly key = 'DTSTAMP';
}