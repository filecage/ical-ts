import Property from "./Property";
import {Duration as DurationValue} from "../ValueTypes/Duration";

export default class Duration extends Property<DurationValue> {
    public readonly key = 'DURATION';
}