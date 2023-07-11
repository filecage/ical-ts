import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";

export default class UniqueIdentifier extends Property<string> {
    public readonly key = 'UID';
}