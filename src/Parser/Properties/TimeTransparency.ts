import Property from "./Property";

export default class TimeTransparency extends Property<'OPAQUE' | 'TRANSPARENT'> {
    public readonly key = 'TRANSP';
}