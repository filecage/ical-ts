import CalendarIterator from "./Parser/CalendarIterator";
import Root from "./Parser/Components/Root";

function parseRoot (calendar: CalendarIterator) {
    const root = new Root();

    return root.parse(calendar);
}

export async function parseFile (path: string) {
    return parseRoot(await CalendarIterator.fromFile(path));
}

export function parseString (raw: string) {
    return parseRoot(CalendarIterator.fromString(raw));
}