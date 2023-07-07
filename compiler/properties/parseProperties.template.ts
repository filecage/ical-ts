/**${TEMPLATE_ONLY_BEGIN}**/
import {SEMICOLON} from "../../src/server/Adapters/ICS/ParserConstants";
import {parseParameters} from "../parameters/parseParameters.template";
import Property from "../../src/server/Adapters/ICS/Parser/Property";
/**${TEMPLATE_ONLY_END}**/
/**${COMPILED_ONLY_BEGIN}**
// THIS FILE IS BEING AUTO GENERATED, DO NOT EDIT!
// @see compiler/parameters/parameters.ts
 import {SEMICOLON} from "../ParserConstants";
 import {parseParameters} from "./parseParameters";
 import Property from "./Property";
/**${COMPILED_ONLY_END}**/
/**${PROPERTIES_IMPORTS}**/

export function parseProperty (key: string, value: string) {
    const fragments = key.split(SEMICOLON);
    const propertyKey = fragments.shift()?.toUpperCase() || '';
    const parameters = parseParameters(fragments);

    switch (propertyKey) {
        /**${PROPERTIES_BLOCK_KEYMATCHER}**/

        default:
            if (key.startsWith('X-') || key.startsWith('IANA-')) {
                return new class extends Property<string> {
                    readonly key;
                    constructor(key: string, value: string) {
                        super(value, {});
                        this.key = key;
                    }
                } (key, value);
            }

            throw new Error(`Unexpected property '${key}'`);
    }

}

function assertEnum<T extends readonly string[]> (propertyName: string, value: string, enums: T) {
    if (enums.includes(value)) {
        return value as typeof enums[number];
    }

    throw new Error(`Property '${propertyName}' value '${value}' is invalid, must be one of: ${enums.join(', ')}`);
}