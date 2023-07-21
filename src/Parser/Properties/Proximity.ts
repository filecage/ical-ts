import Property from "./Property";

export default class Proximity extends Property<string | 'ARRIVE' | 'DEPART' | 'CONNECT' | 'DISCONNECT'> {
    public readonly key = 'PROXIMITY';
}