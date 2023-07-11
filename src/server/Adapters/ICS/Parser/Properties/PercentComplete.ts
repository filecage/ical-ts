import Property from "./Property";
import {Parameters} from "../../Parameters";
import {Raw} from "../ValueTypes/Raw";

export default class PercentComplete extends Property<number> {
    public readonly key = 'PERCENT-COMPLETE';
}