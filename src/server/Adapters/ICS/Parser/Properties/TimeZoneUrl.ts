import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";
import {Uri} from "../ValueTypes/Uri";

export default class TimeZoneUrl extends Property<Uri> {
    public readonly key = 'TZURL';
}