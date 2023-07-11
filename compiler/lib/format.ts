export function format (code: string, indent: number = 0) : string {
    const lines = code.split("\n");
    const junk = lines[lines.length - 1].match(/^(?<indent>\s+)\S+/)?.groups?.indent;
    const junkRegexp = new RegExp(`^\\s{${junk?.length || 0}}`);

    let last: undefined|string;
    return lines.map(line => {
        // remove indent from source
        line = line.replace(junkRegexp, '');

        if (last !== undefined) {
            // add indent that is requested, but never for the first line
            line = ' '.repeat(indent) + line;
        }

        if (last?.trim() === '' && line.trim() === '') {
            // if the last line was empty, we don't want another empty one here
            return null;
        }

        last = line;

        return line;
    }).filter(line => line !== null).join("\n");
}