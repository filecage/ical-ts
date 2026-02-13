import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";
import {Uri} from "../ValueTypes/Uri";

export default class Conference extends Property<Uri, Parameters.Feature & Parameters.Label> {
    public readonly key = 'CONFERENCE';
}