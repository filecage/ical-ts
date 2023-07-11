import Property from "./Property";
import {Parameters} from "../../Parameters";
import ParticipationStatusTodo = Parameters.ParticipationStatusTodo;

// We're taking the values from the ParticipationStatus property, they seem to be identical
export default class Status extends Property<ParticipationStatusTodo['PARTSTAT']> {
    public readonly key = 'STATUS';
}