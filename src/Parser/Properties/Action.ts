import Property from "./Property";

export default class Action extends Property<string | 'AUDIO' | 'DISPLAY' | 'EMAIL'> {
    public readonly key = 'ACTION';
}