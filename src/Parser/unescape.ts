/**
 * @internal
 */
export default function unescape(input: string, escapeCharacter: string, decodeEscape: (character: string) => string, keepTrailingEscape: boolean): string {
    let buffer = '';
    let escaped = false;

    for (let i = 0; i < input.length; i++) {
        const character = input[i];

        if (escaped) {
            escaped = false;
            buffer += decodeEscape(character);
        } else if (character === escapeCharacter) {
            escaped = true;
        } else {
            buffer += character;
        }
    }

    return buffer + (escaped && keepTrailingEscape ? escapeCharacter : '');
}
