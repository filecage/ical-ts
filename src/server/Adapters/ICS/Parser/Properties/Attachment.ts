import Property from "../Property";
import {Parameters} from "../../Parameters";
import {Raw} from "../ValueTypes/Raw";

/**
 *        attach     = "ATTACH" attachparam ( ":" uri ) /
 *                     (
 *                       ";" "ENCODING" "=" "BASE64"
 *                       ";" "VALUE" "=" "BINARY"
 *                       ":" binary
 *                     )
 *                     CRLF
 */
export default class Attachment extends Property<Raw,
    Parameters.FormatType &
    // RFC 5545 states that these parameters are valid for ATTACH,
    // but they are not included in the format definition. I'm not sure
    // whether it's right to include them here then or whether they should
    // be part of the value type instead
    // TODO: Clarify
    Parameters.ValueDataTypes &
    Parameters.InlineEncoding
> {
    public readonly key = 'ATTACH';
}