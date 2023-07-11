import Property from "./Property";
import {Parameters} from "../../Parameters";

export default class Resources extends Property<string,
    Parameters.Language &
    Parameters.AlternateTextRepresentation
> {
    public readonly key = 'RESOURCES';
}