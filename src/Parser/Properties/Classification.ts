import Property from "./Property";

export default class Classification extends Property<string | 'PUBLIC' | 'PRIVATE' | 'CONFIDENTIAL'> {
    public readonly key = 'CLASS';
}