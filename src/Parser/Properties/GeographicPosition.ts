import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";
import {Raw} from "../ValueTypes/Raw";

/**
 *    Format Definition:  This property is defined by the following
 *       notation:
 *
 *        geo        = "GEO" geoparam ":" geovalue CRLF
 *
 *        geoparam   = *(";" other-param)
 *
 *        geovalue   = float ";" float
 *        ;Latitude and Longitude components
 *
 *    Example:  The following is an example of this property:
 *
 *        GEO:37.386013;-122.082932
 */
export default class GeographicPosition extends Property<Raw, {}> {
    public readonly key = 'GEO';
}