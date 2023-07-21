import Property from "./Property";
import {Uri} from "../ValueTypes/Uri";

export default class UniformResourceLocator extends Property<Uri> {
    public readonly key = 'URL';
}