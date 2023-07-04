import fs from "fs/promises";
import {resolve, dirname, join} from "path";
import { fileURLToPath } from "url";
import ts from "typescript";

function buildPathRelativeToApplication (fileName: string) : string {
    return resolve(join(dirname(fileURLToPath(import.meta.url)), '/../../', fileName));
}

export async function exportSourceFileRaw (fileName: string, code: string) {
    return await fs.writeFile(buildPathRelativeToApplication(fileName), code, 'utf8');
}

export async function readSourceFileRaw (fileName: string) : Promise<string> {
    return await fs.readFile(buildPathRelativeToApplication(fileName), 'utf8');
}

export async function readSourceFile (fileName: string) : Promise<ts.SourceFile> {
    const fileContents = await readSourceFileRaw(fileName);

    return ts.createSourceFile(
        fileName,
        fileContents,
        ts.ScriptTarget.Latest,
        /*setParentNodes */ true
    );
}