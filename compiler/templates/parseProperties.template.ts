/**${TEMPLATE_ONLY_BEGIN}**/
import Property from "../../src//Parser/Properties/Property";
import {SEMICOLON} from "../../src/Parser/Constants";
import {parseParameters} from "./parseParameters.template";
/**${TEMPLATE_ONLY_END}**/
/**${COMPILED_ONLY_BEGIN}**
// THIS FILE IS BEING AUTO GENERATED, DO NOT EDIT!
// @see compiler/properties.ts
 import {SEMICOLON} from "./Constants";
 import {parseParameters} from "./parseParameters";
 import Property from "./Properties/Property";
/**${COMPILED_ONLY_END}**/
/**${PROPERTIES_IMPORTS}**/

export function parseProperty (key: string, value: string) {
    const fragments = key.split(SEMICOLON);
    const propertyKey = fragments.shift()?.toUpperCase() || '';
    const parameters = parseParameters(fragments);

    switch (propertyKey) {
        /**${PROPERTIES_BLOCK_KEYMATCHER}**/

        default:
            if (propertyKey.startsWith('X-') || propertyKey.startsWith('IANA-')) {
                return new class extends Property<string> {
                    readonly key;
                    constructor(key: string, value: string) {
                        super(value, {});
                        this.key = key;
                    }
                } (key, value);
            }

            throw new Error(`Unexpected property '${propertyKey}'`);
    }

}

function assertEnum<T extends readonly string[]> (propertyName: string, value: string, enums: T) {
    if (enums.includes(value)) {
        return value as typeof enums[number];
    }

    throw new Error(`Invalid value '${value}' for property '${propertyName}', must be one of: ${enums.join(', ')}`);
}