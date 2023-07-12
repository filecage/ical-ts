import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";

// We're taking the values from the ParticipationStatus property, they seem to be identical
export default class Status extends Property<Parameters.ParticipationStatusTodo['PARTSTAT']> {
    public readonly key = 'STATUS';
}