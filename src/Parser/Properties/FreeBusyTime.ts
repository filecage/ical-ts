import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";
import {Duration} from "../ValueTypes/Duration";
import {Period} from "../ValueTypes/Period";

export default class FreeBusyTime extends Property<Period[],
    Parameters.FreeBusyTimeType
> {
    public readonly key = 'FREEBUSY';
}