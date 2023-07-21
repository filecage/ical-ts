import Property from "./Property";
import {Raw} from "../ValueTypes/Raw";

export default class Sequence extends Property<Raw> {
    public readonly key = 'SEQUENCE';
}