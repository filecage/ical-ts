import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";
import {Uri} from "../ValueTypes/Uri";

export default class UniformResourceLocator extends Property<Uri> {
    public readonly key = 'URL';
}