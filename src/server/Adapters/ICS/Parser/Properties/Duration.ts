import Property from "../Property";
import {Duration as DurationValue} from "../ValueTypes/Duration";
import {Parameters} from "../../Parameters";

export default class Duration extends Property<DurationValue> {
    public readonly key = 'DURATION';
}