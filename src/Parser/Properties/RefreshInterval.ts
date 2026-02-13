import Property from "./Property";
import {Duration} from "../ValueTypes/Duration";
import {Parameters} from "../Parameters/Parameters";

// TODO: RFC7968 requires `VALUE=DURATION` parameter, but our parser treats all parameters as optional, see https://github.com/filecage/ical-ts/issues/5
export default class RefreshInterval extends Property<Duration, Parameters.ValueDataTypes> {
    public readonly key = 'REFRESH-INTERVAL';
}