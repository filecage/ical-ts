import Property from "./Property";
import {Recur} from "../ValueTypes/Recur";

export default class RecurrenceRule extends Property<Recur> {
    public readonly key = 'RRULE';
}