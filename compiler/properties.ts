import ts from "typescript";
import {exportSourceFileRaw, iterateSourceFiles, readSourceFileRaw} from "./lib/readSourceFile";
import {format} from "./lib/format";
import TypeCompiler from "./lib/TypeCompiler";
import {Type} from "./lib/Type";
import {flattenTypeEnums, flattenTypeParserFns} from "./lib/flattenTypeEnums";
import {ValueParserFn} from "../src/Parser/parseValues";

// Map all exported value parsers to an indexed object
const valueParserFns = Object.entries(await import('../src/Parser/parseValues'))
    .reduce((parsers: {[key: string]: ValueParserFn}, [name, fn]) => ({...parsers, [name]: fn}), {});

const valueTypeParserMap: {[k:string]: ValueParserFn} = {
    __number: valueParserFns.parseNumber,
    CalAddress: valueParserFns.parseValueRaw,
    DateTime: valueParserFns.parseDateTime,
    UTCDateTime: valueParserFns.parseDateTime,
    DurationValue: valueParserFns.parseValueRaw, // TODO: The Duration property renames the import, we currently don't understand that correctly so we have to define this twice
    Duration: valueParserFns.parseValueRaw,
    Offset: valueParserFns.parseValueRaw,
    Period: valueParserFns.parsePeriod,
    Raw: valueParserFns.parseValueRaw,
    Recur: valueParserFns.parseValueRaw,
    Uri: valueParserFns.parseValueRaw,
    ParticipationStatusTodo: valueParserFns.parseValueRaw,
}

const properties: {key: string, valueType: Type, customValueParserFn?: ValueParserFn}[] = [];
for await (const propertySource of iterateSourceFiles('src/Parser/Properties')) {
    const propertyClass = propertySource.statements.find(statement => {
        if (![ts.SyntaxKind.ClassDeclaration, ts.SyntaxKind.InterfaceDeclaration].includes(statement.kind)) {
            return false;
        }

        const hasExport = (statement as ts.ClassDeclaration).modifiers?.find(member => member.kind === ts.SyntaxKind.ExportKeyword) !== undefined;
        const hasDefault = (statement as ts.ClassDeclaration).modifiers?.find(member => member.kind === ts.SyntaxKind.DefaultKeyword) !== undefined;

        return hasExport && hasDefault;
    }) as ts.ClassDeclaration|ts.InterfaceDeclaration|undefined;

    if (propertyClass === undefined) {
        throw new Error(`Invalid property definition: missing exported default class declaration in file '${propertySource.fileName}'`);
    }

    const propertyName = propertyClass.name?.text;
    if (propertyName === undefined) {
        throw new Error(`Invalid property definition: exported default class declaration is anonymous in file '${propertySource.fileName}'`);
    }

    // Skip interfaces
    if (ts.isInterfaceDeclaration(propertyClass)) {
        console.log(`INFO: Skipping interface declaration '${propertyName}'`);
        continue;
    }

    // Skip abstracts
    if (propertyClass.modifiers?.find(modifier => modifier.kind === ts.SyntaxKind.AbstractKeyword)) {
        console.log(`INFO: Skipping abstract class  '${propertyName}'`);
        continue;
    }

    // Property class must inherit from Property base class
    const inherits = propertyClass.heritageClauses
        ?.find(heritageClause => heritageClause.token === ts.SyntaxKind.ExtendsKeyword)
        ?.types.find(type => (type.expression as ts.Identifier).text === 'Property');

    if (inherits === undefined) {
        throw new Error(`Invalid property definition: must inherit from 'Property' class for property '${propertyName}'`);
    }

    // Let's look for a custom value type definition
    const customValueParserFn = findCustomValueParserFnIfAvailable(propertyClass, propertyName);
    const typeCompiler = new TypeCompiler(valueParserFns.parseValueRaw, valueTypeParserMap);
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
        valueType: {
            ...valueType,
            parserFn: customValueParserFn?.name || valueType.parserFn
        },
    });
}

function findCustomValueParserFnIfAvailable (propertyClass: ts.ClassDeclaration, propertyName: string) : ValueParserFn|undefined {
    const customValueParserImplementsType = propertyClass.heritageClauses
        ?.filter(heritageClause => heritageClause.token === ts.SyntaxKind.ImplementsKeyword)
        ?.map(heritageClause => heritageClause.types)
        ?.find(types => types.find(type => (type.expression as ts.Identifier).text === 'CustomValueParserFn'))
        ?.at(0);

    if (customValueParserImplementsType === undefined) {
        return undefined;
    }

    const typeDefinition= customValueParserImplementsType.typeArguments?.at(0);
    if (typeDefinition === undefined || typeDefinition.kind !== ts.SyntaxKind.TypeQuery) {
        throw new Error(`Invalid CustomValueType definition for property '${propertyName}': Missing or invalid type definition, must be 'typeof' definition`);
    }

    const valueParserFnName = ((typeDefinition as ts.TypeQueryNode).exprName as ts.Identifier).text;
    if (valueParserFns[valueParserFnName] === undefined) {
        throw new Error(`Invalid CustomValueType definition for property '${propertyName}': Unknown value parser function '${valueParserFnName}', must be defined in parseValues.ts`);
    }

    return valueParserFns[valueParserFnName];
}


const imports: string[] = [];
const switchBlocks: string[] = [];
const customParserFunctions: string[] = [];

// Add value parser function imports
const valueParserFnsInUse = properties.reduce((valueParserFnsInUse: ValueParserFn[], {valueType}) => [...valueParserFnsInUse, ...flattenTypeParserFns(valueType, valueParserFns)], []);
imports.push(compileValueParserImports([...valueParserFnsInUse, valueParserFns.parseList]));

properties.forEach(({key, valueType}) => {
    switchBlocks.push(compileKeyMatcherBlock(key, valueType));
    imports.push(compileImport(valueType));
});

// Read file, replace tokens and write to application path
let code = await readSourceFileRaw('compiler/templates/parseProperties.template.ts');
code = code.replace('/**${PROPERTIES_BLOCK_KEYMATCHER}**/', format(switchBlocks.join("\n"), 8));
code = code.replace('/**${PROPERTIES_IMPORTS}**/', imports.join("\n"));
code = code.replace('/**${PROPERTIES_PARSER_FUNCTIONS}**/', customParserFunctions.join("\n"));
code = code.replace(/\/\**\${TEMPLATE_ONLY_BEGIN}\**\/.*\/\**\${TEMPLATE_ONLY_END}\**\//s, '');
code = code.replace(/\/\**\${COMPILED_ONLY_BEGIN}\**(.*)\/\**\${COMPILED_ONLY_END}\**\//s, '$1');

await exportSourceFileRaw('src/Parser/parseProperties.ts', format(code));

console.log("OK: 'src/Parser/parseProperties.ts' written");

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
    const flatType = flattenTypeEnums(type);
    if (!flatType.allowsAnyString && flatType.enums.length > 0) {
        return `assertEnum('${type.name}', ${parserFnCall}, [${flatType.enums.map(enumValue => `'${enumValue}'`).join(', ')}] as const)`;
    }

    return parserFnCall;
}

function compileImport(type: Type) : string {
    return `import ${type.name} from "./Properties/${type.name}";`;
}

function compileValueParserImports (valueParserFns: ValueParserFn[]) : string {
    return format(`import {${[...new Set(valueParserFns)].sort().map(fn => fn.name).join(', ')}} from "./parseValues"`);
}