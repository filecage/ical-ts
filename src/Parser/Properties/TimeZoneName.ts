import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";

export default class TimeZoneName extends Property<string,
    Parameters.Language
> {
    public readonly key = 'TZNAME';
}