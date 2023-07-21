import Property from "./Property";
import {UTCDateTime} from "../ValueTypes/DateTime";

export default class LastModified extends Property<UTCDateTime> {
    public readonly key = 'LAST-MODIFIED';
}