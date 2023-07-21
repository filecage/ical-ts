import Property from "./Property";
import {UTCDateTime} from "../ValueTypes/DateTime";

export default class DateTimeCompleted extends Property<UTCDateTime> {
    public readonly key = 'COMPLETED';
}