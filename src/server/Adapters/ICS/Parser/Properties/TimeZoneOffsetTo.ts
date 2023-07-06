import Property from "../Property";
import {Parameters} from "../../Parameters";
import {Offset} from "../ValueTypes/Offset";

export default class TimeZoneOffsetTo extends Property<Offset> {
    public readonly key = 'TZOFFSETTO';
}