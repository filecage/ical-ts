import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";

export default class Proximity extends Property<string | 'ARRIVE' | 'DEPART' | 'CONNECT' | 'DISCONNECT'> {
    public readonly key = 'PROXIMITY';
}