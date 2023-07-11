import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";
import {Raw} from "../ValueTypes/Raw";

/**
 * Format Definition:  This property is defined by the following
 *       notation:
 *
 *        priority   = "PRIORITY" prioparam ":" priovalue CRLF
 *        ;Default is zero (i.e., undefined).
 *
 *        prioparam  = *(";" other-param)
 *
 *        priovalue   = integer       ;Must be in the range [0..9]
 *           ; All other values are reserved for future use.
 *
 *    Example:  The following is an example of a property with the highest
 *       priority:
 *
 *        PRIORITY:1
 *
 *       The following is an example of a property with a next highest
 *       priority:
 *
 *        PRIORITY:2
 *
 *       The following is an example of a property with no priority.  This
 *       is equivalent to not specifying the "PRIORITY" property:
 *
 *        PRIORITY:0
 */
export default class Priority extends Property<Raw> {
    public readonly key = 'PRIORITY';
}