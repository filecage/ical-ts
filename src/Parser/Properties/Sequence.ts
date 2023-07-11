import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";
import {Raw} from "../ValueTypes/Raw";

export default class Sequence extends Property<Raw> {
    public readonly key = 'SEQUENCE';
}