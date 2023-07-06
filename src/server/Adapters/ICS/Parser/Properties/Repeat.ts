import Property from "../Property";
import {Parameters} from "../../Parameters";
import {Raw} from "../ValueTypes/Raw";

export default class Repeat extends Property<Raw> {
    public readonly key = 'REPEAT';
}