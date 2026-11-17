import indexOfUnquoted from "../Util/indexOfUnquoted";
import {SEMICOLON} from "./Constants";

/**
 * @internal
 */
export function parseFragments (input: string) : string[] {
    const fragments = [];

    let start = 0;
    while (start < input.length) {
        const end = indexOfUnquoted(input, SEMICOLON, start);

        if (end === -1) {
            // no more additional fragments, just add everything until the end
            fragments.push(input.substring(start));
            break;
        }

        fragments.push(input.substring(start, end));
        start = end + 1;
    }

    return fragments;
}