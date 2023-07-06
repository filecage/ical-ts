import Property from "../Property";
import {Parameters} from "../../Parameters";

export default class TimeTransparency extends Property<'OPAQUE' | 'TRANSPARENT'> {
    public readonly key = 'TRANSP';
}