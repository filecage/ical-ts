import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";

export default class Version extends Property<'2.0'> {
    public readonly key = 'VERSION';
}