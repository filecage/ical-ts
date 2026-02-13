import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";
import {Uri} from "../ValueTypes/Uri";

export default class Image extends Property<Uri|string, Parameters.ValueDataTypes & Parameters.InlineEncoding> {
    public readonly key = 'IMAGE';
}