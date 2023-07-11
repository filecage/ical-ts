import Property from "./Property";
import {Parameters} from "../../Parameters";
import {DateTime, UTCDateTime} from "../ValueTypes/DateTime";

export default class DateTimeCompleted extends Property<UTCDateTime> {
    public readonly key = 'COMPLETED';
}