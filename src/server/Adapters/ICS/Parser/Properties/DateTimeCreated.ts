import Property from "./Property";
import {Parameters} from "../../Parameters";
import {UTCDateTime} from "../ValueTypes/DateTime";

export default class DateTimeCreated extends Property<UTCDateTime> {
    public readonly key = 'CREATED';
}