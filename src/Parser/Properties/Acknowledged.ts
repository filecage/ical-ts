import Property from "./Property";
import {UTCDateTime} from "../ValueTypes/DateTime";

export default class Acknowledged extends Property<UTCDateTime> {
    public readonly key = 'ACKNOWLEDGED';
}