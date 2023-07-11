import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";

export default class Description extends Property<string,
    Parameters.Language &
    Parameters.AlternateTextRepresentation
> {
    public readonly key = 'DESCRIPTION';
}