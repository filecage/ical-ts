// to unfold content lines according to https://datatracker.ietf.org/doc/html/rfc5545#section-3.1
import {SPACE} from "./Constants";

/**
 * @internal This will most likely change once we move to reading calendars in a stream
 * @param lines
 */
export function unfold (lines: string[]) : string[] {
    return lines.reduce((buffer: string[], line) => {
        if (line.startsWith(SPACE)) {
            buffer[buffer.length - 1] += line.substring(1);
        } else {
            buffer.push(line);
        }

        return buffer;
    }, []);
}