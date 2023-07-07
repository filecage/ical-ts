/**${TEMPLATE_ONLY_BEGIN}**/
import {EQUAL} from "../../src/server/Adapters/ICS/ParserConstants";
/**${TEMPLATE_ONLY_END}**/
/**${COMPILED_ONLY_BEGIN}**
// THIS FILE IS BEING AUTO GENERATED, DO NOT EDIT!
// @see compiler/parameters/parameters.ts
import {EQUAL, SEMICOLON} from "../ParserConstants";
import {Parameters} from "../Parameters";
/**${COMPILED_ONLY_END}**/


// TODO: Replace these with the shared value parsers
export function parseUriValue (value: string): string {
    return value;
}

export function parseCalAddressValue (value: string) : string {
    return value;
}

export function parseLanguageTag (value: string) : string {
    return value;
}

export function parseValue (value: string): string {
    return value;
}

export function parseParameters (fragments: string[]) /**${PARAMETERS_INTERSECTION_RETURN_TYPE}**/ {
    return fragments.reduce((parameters, fragment) => {
        const [parameterKey, parameterValue] = fragment.split(EQUAL);

        switch (parameterKey) {
            /**${PARAMETERS_BLOCK_KEYMATCHER}**/

            default:
                if (parameterKey.startsWith('X-') || parameterKey.startsWith('IANA-')) {
                    return {[parameterKey]: parseValue(parameterValue)};
                }

                throw new Error(`Invalid parameter '${parameterKey}'`);
        }
    }, {});
}

namespace parser {
    /**${PARAMETERS_PARSER_FUNCTIONS}**/
}