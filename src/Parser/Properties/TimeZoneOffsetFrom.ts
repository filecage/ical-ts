import Property from "./Property";
import {Offset} from "../ValueTypes/Offset";

export default class TimeZoneOffsetFrom extends Property<Offset> {
    public readonly key = 'TZOFFSETFROM';
}