import ts from "typescript";
import {exportSourceFileRaw, iterateSourceFiles, readSourceFileRaw} from "../util/readSourceFile";
import TypeCompiler from "../parameters/TypeCompiler";
import {format} from "../util/format";
import {Type} from "../parameters/Type";
import {parseDateTime, parseList, parseNumber, parsePeriod, parseValueRaw, ValueParserFn} from "../../src/server/Adapters/ICS/Parser/parseValues";
import {flattenType} from "../util/flattenType";

const valueTypeParserMap = {
    __number: parseNumber,
    CalAddress: parseValueRaw,
    DateTime: parseDateTime,
    UTCDateTime: parseDateTime,
    DurationValue: parseValueRaw, // TODO: The Duration property renames the import, we currently don't understand that correctly so we have to define this twice
    Duration: parseValueRaw,
    Offset: parseValueRaw,
    Period: parsePeriod,
    Raw: parseValueRaw,
    Recur: parseValueRaw,
    Uri: parseValueRaw,
    ParticipationStatusTodo: parseValueRaw,
}

const properties = [];
for await (const propertySource of iterateSourceFiles('src/server/Adapters/ICS/Parser/Properties')) {
    const propertyClass = propertySource.statements.find(statement => {
        if (statement.kind !== ts.SyntaxKind.ClassDeclaration) {
            return false;
        }

        const hasExport = (statement as ts.ClassDeclaration).modifiers?.find(member => member.kind === ts.SyntaxKind.ExportKeyword) !== undefined;
        const hasDefault = (statement as ts.ClassDeclaration).modifiers?.find(member => member.kind === ts.SyntaxKind.DefaultKeyword) !== undefined;

        return hasExport && hasDefault;
    }) as ts.ClassDeclaration|undefined;

    if (propertyClass === undefined) {
        throw new Error(`Invalid property definition: missing exported default class declaration in file '${propertySource.fileName}'`);
    }

    const propertyName = propertyClass.name?.text;
    if (propertyName === undefined) {
        throw new Error(`Invalid property definition: exported default class declaration is anonymous in file '${propertySource.fileName}'`);
    }

    // Property class must inherit from Property base class
    const inherits = propertyClass.heritageClauses
        ?.find(heritageClause => heritageClause.token === ts.SyntaxKind.ExtendsKeyword)
        ?.types.find(type => (type.expression as ts.Identifier).text === 'Property');

    if (inherits === undefined) {
        throw new Error(`Invalid property definition: must inherit from 'Property' class for property '${propertyName}'`);
    }

    const typeCompiler = new TypeCompiler(parseValueRaw, valueTypeParserMap);
    const propertyTypeNodes = inherits.typeArguments
    if (propertyTypeNodes === undefined) {
        throw new Error(`Missing types definition for property '${propertyName}'`)
    }

    const valueType = typeCompiler.handleType(propertyTypeNodes[0], propertyName, undefined);
    const keyDeclaration = propertyClass.members.find(member => member.kind === ts.SyntaxKind.PropertyDeclaration && (member.name as ts.Identifier).text === 'key') as ts.PropertyDeclaration|undefined;
    if (keyDeclaration === undefined) {
        throw new Error(`Missing correct class property 'key' for property '${propertyName}`);
    }

    const keyInitializer = keyDeclaration.initializer;
    if (keyInitializer === undefined || keyInitializer.kind !== ts.SyntaxKind.StringLiteral) {
        throw new Error(`Invalid class property 'key' for property '${propertyName}': initializer must be a string literal expression`);
    }

    properties.push({
        key: (keyInitializer as ts.StringLiteral).text,
        valueType,
    });
}


const imports: string[] = [];
const switchBlocks: string[] = [];
const customParserFunctions: string[] = [];

// Add value parser function imports
imports.push(compileValueParserImports([...Object.values(valueTypeParserMap), parseList]));

properties.forEach(({key, valueType}) => {
    switchBlocks.push(compileKeyMatcherBlock(key, valueType));
    imports.push(compileImport(valueType));
});

// Read file, replace tokens and write to application path
let code = await readSourceFileRaw('compiler/properties/parseProperties.template.ts');
code = code.replace('/**${PROPERTIES_BLOCK_KEYMATCHER}**/', format(switchBlocks.join("\n"), 8));
code = code.replace('/**${PROPERTIES_IMPORTS}**/', imports.join("\n"));
code = code.replace('/**${PROPERTIES_PARSER_FUNCTIONS}**/', customParserFunctions.join("\n"));
code = code.replace(/\/\**\${TEMPLATE_ONLY_BEGIN}\**\/.*\/\**\${TEMPLATE_ONLY_END}\**\//s, '');
code = code.replace(/\/\**\${COMPILED_ONLY_BEGIN}\**(.*)\/\**\${COMPILED_ONLY_END}\**\//s, '$1');

await exportSourceFileRaw('src/server/Adapters/ICS/Parser/parseProperties.ts', format(code));

console.log("OK: 'src/server/Adapters/ICS/Parser/parseProperties.ts' written");

function compileKeyMatcherBlock (key: string, type: Type) : string {
    return format(`case '${key}': return new ${type.name}(${compileParserFnCall(type)}, parameters);`);
}

function compileParserFnCall (type: Type) : string {
    if (type.isList) {
        return `parseList(value).map(value => ${compileParserFnCallSingleValue(type)})`;
    }

    return compileParserFnCallSingleValue(type);
}

function compileParserFnCallSingleValue (type: Type) : string {
    const parserFnCall = `${type.parserFn}(value)`;
    const flatType = flattenType(type);
    if (!flatType.allowsAnyString && flatType.enums.length > 0) {
        return `assertEnum('${type.name}', ${parserFnCall}, [${flatType.enums.map(enumValue => `'${enumValue}'`).join(', ')}] as const)`;
    }

    return parserFnCall;
}

function compileImport(type: Type) : string {
    return `import ${type.name} from "./Properties/${type.name}";`;
}

function compileValueParserImports (valueParserFns: ValueParserFn[]) : string {
    return format(`import {${[...new Set(valueParserFns)].map(fn => fn.name).join(', ')}} from "./parseValues"`);
}