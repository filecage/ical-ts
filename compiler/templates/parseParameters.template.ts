/**${TEMPLATE_ONLY_BEGIN}**/
import {EQUAL} from "../../src/Parser/Constants";
import {parseValueRaw} from "../../src/Parser/parseValues";
/**${TEMPLATE_ONLY_END}**/
/**${COMPILED_ONLY_BEGIN}**
// THIS FILE IS BEING AUTO GENERATED, DO NOT EDIT!
// @see compiler/parameters.ts
import {EQUAL, SEMICOLON} from "./Constants";
import {Parameters} from "./Parameters/Parameters";
/**${COMPILED_ONLY_END}**/
/**${IMPORTS}**/

export function parseParameters (fragments: string[]) /**${PARAMETERS_INTERSECTION_RETURN_TYPE}**/ {
    return fragments.reduce((parameters, fragment) => {
        const [parameterKey, parameterValue] = fragment.split(EQUAL);

        switch (parameterKey) {
            /**${PARAMETERS_BLOCK_KEYMATCHER}**/

            default:
                if (parameterKey.startsWith('X-') || parameterKey.startsWith('IANA-')) {
                    return {...parameters, [parameterKey]: parseValueRaw(parameterValue)};
                }

                throw new Error(`Invalid parameter '${parameterKey}'`);
        }
    }, {});
}

namespace parser {
    /**${PARAMETERS_PARSER_FUNCTIONS}**/
}