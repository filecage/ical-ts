import {readFile} from "fs/promises";
import {COLON, END, NEW_LINE} from "./Constants";
import {unfold} from "./unfold";

export default class CalendarIterator {
    // TODO: Allow contents to be streamed for a lighter memory profile during execution
    private contents: string[];

    static async fromFile (path: string) : Promise<CalendarIterator> {
        return CalendarIterator.fromString(await readFile(path, 'utf8'));
    }

    static fromString (raw: string) : CalendarIterator {
        return new CalendarIterator(raw.split(NEW_LINE));
    }

    private constructor(contents: string[]) {
        this.contents = unfold(contents);
    }

    *iterate() : Generator<{ name: string, value: string }> {
        let line = this.contents.shift();
        while (line !== undefined) {
            // Only process the line if it's not empty
            if (line.trim() !== '') {
                const index = line.indexOf(COLON);
                const name = line.substring(0, index);
                const value = line.substring(index + 1);

                yield {name, value};

                if (name === END) {
                    // When blocks end, we stop the iterator to give the consumer
                    // the chance to switch the context
                    return;
                }
            }

            // Read next line
            line = this.contents.shift();
        }
    }

    get consumed () {
        return this.contents.length === 0;
    }

}