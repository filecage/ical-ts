import {readFile} from "fs/promises";
import {resolve, dirname, join} from "path";
import { fileURLToPath } from 'url';

export async function readSample (sample: string) : Promise<string> {
    const file = resolve(join(dirname(fileURLToPath(import.meta.url)), '/../__samples__/ics', sample));

    return await readFile(file, 'utf8');
}