/**${TEMPLATE_ONLY_BEGIN}**/
import {EQUAL, SEMICOLON} from "../../src/server/Adapters/ICS/ParserConstants";
import {Parameters} from "../../src/server/Adapters/ICS/Parameters";
/**${TEMPLATE_ONLY_END}**/
/**${COMPILED_ONLY_BEGIN}**
// THIS FILE IS BEING AUTO GENERATED, DO NOT EDIT!
// @see compiler/parameters/parameters.ts
import {EQUAL, SEMICOLON} from "../ParserConstants";
import {Parameters} from "../Parameters";
/**${COMPILED_ONLY_END}**/

export interface ParameterValueParserFn {
    (value: string): string
}

export const parseUriValue: ParameterValueParserFn = (value: string) : string => value;
export const parseCalAddressValue: ParameterValueParserFn = (value: string) : string => value;
export const parseLanguageTag: ParameterValueParserFn = (value: string) : string => value;
export const parseValue: ParameterValueParserFn = (value: string) : string => value;

export function parseParameters (fragments: string[]) {
    return fragments.reduce((parameters, fragment) => {
        const [parameterKey, parameterValue] = fragment.split(EQUAL);

        switch (parameterKey) {
            /**${PARAMETERS_BLOCK_KEYMATCHER}**/

            default:
                throw new Error(`Invalid parameter '${parameterKey}'`);
        }
    }, {});
}

namespace parser {
    /**${PARAMETERS_PARSER_FUNCTIONS}**/
}