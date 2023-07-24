import {ValueParserFn} from "../../src/Parser/parseValues";
import {format} from "./format";

export function compileValueParserImports (valueParserFns: ValueParserFn[]) : string {
    return format(`import {${[...new Set(valueParserFns)].sort().map(fn => fn.name).join(', ')}} from "./parseValues"`);
}