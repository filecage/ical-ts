import {BACKSLASH, QUOTES, SEMICOLON} from "./Constants";

/**
 * @internal
 */
export function parseFragments (input: string) : string[] {
    const fragments = [];

    let buffer = '';
    let escaped = false;
    let quoted = false;

    for (let i= 0; i < input.length; i++) {
        const character = input[i];

        switch (character) {
            case SEMICOLON:
                if (!quoted && !escaped) {
                    fragments.push(buffer);
                    buffer = '';
                    continue;
                }
                break;

            case QUOTES:
                if (!escaped) {
                    quoted = !quoted;
                }
                break;
        }

        escaped = character === BACKSLASH && !escaped;
        if (!escaped) {
            buffer += character;
        }
    }

    // Add remainder
    fragments.push(buffer);

    return fragments;
}