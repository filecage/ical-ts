import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";

export default class Categories extends Property<string, Parameters.Language> {
    public readonly key = 'CATEGORIES';
}