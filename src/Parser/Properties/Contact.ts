import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";

export default class Contact extends Property<string,
    Parameters.AlternateTextRepresentation & Parameters.Language
> {
    public readonly key = 'CONTACT';
}