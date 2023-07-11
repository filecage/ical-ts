import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";

export default class Action extends Property<string | 'AUDIO' | 'DISPLAY' | 'EMAIL'> {
    public readonly key = 'ACTION';
}