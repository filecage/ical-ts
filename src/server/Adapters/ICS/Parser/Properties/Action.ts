import Property from "./Property";
import {Parameters} from "../../Parameters";

export default class Action extends Property<string | 'AUDIO' | 'DISPLAY' | 'EMAIL'> {
    public readonly key = 'ACTION';
}