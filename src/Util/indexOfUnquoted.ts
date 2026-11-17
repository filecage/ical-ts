import {QUOTES} from "../Parser/Constants";

/**
 * @internal
 */
export default function indexOfUnquoted(input: string, delimiter: string, start: number = 0, escapeCharacter: null|string = null) : number {
    let quoted = false;
    let escaped = false;

    for (let i = start; i < input.length; i++) {
        const character = input[i];
        if (!escaped && character === QUOTES) {
            quoted = !quoted;
        }

        if (!quoted && character === delimiter) {
            return i;
        }

        escaped = character === escapeCharacter && !escaped;
    }

    return -1;
}
