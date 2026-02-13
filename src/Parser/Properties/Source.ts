import Property from "./Property";
import {Uri} from "../ValueTypes/Uri";

export default class Source extends Property<Uri> {
    public readonly key = 'SOURCE';
}