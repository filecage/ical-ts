/**${TEMPLATE_ONLY_BEGIN}**/
import {EQUAL} from "../../src/Parser/Constants";
/**${TEMPLATE_ONLY_END}**/
/**${COMPILED_ONLY_BEGIN}**
// THIS FILE IS BEING AUTO GENERATED, DO NOT EDIT!
// @see compiler/parameters.ts
import {EQUAL, SEMICOLON} from "./Constants";
import {Parameters} from "./Parameters/Parameters";
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
                    return {...parameters, [parameterKey]: parseValue(parameterValue)};
                }

                throw new Error(`Invalid parameter '${parameterKey}'`);
        }
    }, {});
}

namespace parser {
    /**${PARAMETERS_PARSER_FUNCTIONS}**/
}