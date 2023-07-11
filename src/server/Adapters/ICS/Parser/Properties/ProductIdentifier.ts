import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";

export default class ProductIdentifier extends Property<string> {
    public readonly key = 'PRODID';
}