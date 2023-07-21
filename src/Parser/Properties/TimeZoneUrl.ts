import Property from "./Property";
import {Uri} from "../ValueTypes/Uri";

export default class TimeZoneUrl extends Property<Uri> {
    public readonly key = 'TZURL';
}