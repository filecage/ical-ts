import ts from "typescript";
import {exportSourceFileRaw, readSourceFile, readSourceFileRaw} from "../util/readSourceFile";
import {parseCalAddressValue, parseLanguageTag, parseUriValue, parseValue} from "./parseParameters.template";
import TypeCompiler from "./TypeCompiler";
import {Type} from "./Type";
import {Parameters} from "../../src/server/Adapters/ICS/Parameters";
import { format } from "../util/format";

const source = await readSourceFile('src/server/Adapters/ICS/Parameters.ts');
const declarationStatement = source.statements[0] as ts.ModuleDeclaration;
if (declarationStatement.kind !== ts.SyntaxKind.ModuleDeclaration || declarationStatement.name?.text !== 'Parameters') {
    console.log('ERROR: Cannot compile parameters, type definition file has unexpected format');
    process.exit(1);
}

const exports: {[key: string]: Type} = {};
const typeCompiler = new TypeCompiler(parseValue,{
    'Uri': parseUriValue,
    'LanguageTag': parseLanguageTag,
    'CalAddress': parseCalAddressValue,
});

declarationStatement.body?.forEachChild(child => {
    if (child.kind !== ts.SyntaxKind.TypeAliasDeclaration) {
        console.log(`INFO: Ignoring token '${child.kind}'`);
        return;
    }

    const parameterDeclaration = child as ts.TypeAliasDeclaration;
    if (parameterDeclaration.modifiers === undefined || parameterDeclaration.modifiers.find(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword) === undefined) {
        console.log(`INFO: Skipping parameter '${parameterDeclaration.name.text}': no export keyword`);
        return;
    }

    if (parameterDeclaration.type.kind !== ts.SyntaxKind.TypeLiteral) {
        console.log(`ERROR: Unknown type definition for parameter '${parameterDeclaration.name.text}', expected '${ts.SyntaxKind.TypeLiteral}' but got '${parameterDeclaration.type.kind}' instead)`);
        process.exit(1);
    }

    const typeLiteral = parameterDeclaration.type as ts.TypeLiteralNode;
    if (typeLiteral.members.length !== 1) {
        console.log(`ERROR: Unexpected amount of type property members for parameter '${parameterDeclaration.name.text}'`);
        process.exit(1);
    }

    const parameterType = typeLiteral.members[0] as ts.PropertySignature;
    if (parameterType.kind !== ts.SyntaxKind.PropertySignature) {
        console.log(`ERROR: Unexpected type property member definition for parameter '${parameterDeclaration.name.text}'`);
        process.exit(1);
    }

    const parameterKeyName = parameterType.name as ts.Identifier | ts.StringLiteral;
    if (parameterKeyName.kind !== ts.SyntaxKind.Identifier && parameterKeyName.kind !== ts.SyntaxKind.StringLiteral) {
        console.log(`ERROR: Unexpected type property key name definition for parameter '${parameterDeclaration.name.text}', must be identifier or string literal`);
        process.exit(1);
    }

    let defaultValue: undefined|string = undefined;
    const defaultTags = ts.getJSDocTags(parameterDeclaration).filter(docTag => docTag.tagName.text.toLowerCase() === 'default');
    if (defaultTags.length >= 1) {
        if (defaultTags.length > 1) {
            console.log(`WARN: Multiple default definitions for parameter '${parameterDeclaration.name.text}', only first one is used`);
        }

        const defaultTag = defaultTags.shift()!.comment;
        if (defaultTag === undefined || typeof defaultTag === 'string') {
            defaultValue = defaultTag;
        } else {
            console.log(`WARN: Can't handle default definitions for parameter '${parameterDeclaration.name.text}'`);
        }
    }

    if (parameterType.type === undefined) {
        console.log(`ERROR: Missing type definition for parameter '${parameterDeclaration.name.text}'`);
        process.exit(1);
    }

    exports[parameterKeyName.text] = typeCompiler.handleType(parameterType.type, parameterDeclaration.name.text, defaultValue);
});

// Here starts the compiler part

const parserFunctions: string[] = [];
const switchBlocks: string[] = [];
Object.entries(exports).map(([parameterKey, parameterType]) => {
    parserFunctions.push(compileParserFunction(parameterKey, parameterType));
    switchBlocks.push(compileKeyMatcherBlock(parameterKey));
});

// Read file, replace tokens and write to application path
let code = await readSourceFileRaw('compiler/parameters/parseParameters.template.ts');
code = code.replace('/**${PARAMETERS_BLOCK_KEYMATCHER}**/', switchBlocks.join("\n"));
code = code.replace('/**${PARAMETERS_PARSER_FUNCTIONS}**/', format(parserFunctions.join("\n\n"), 4));
code = code.replace(/\/\**\${TEMPLATE_ONLY_BEGIN}\**\/.*\/\**\${TEMPLATE_ONLY_END}\**\//s, '');
code = code.replace(/\/\**\${COMPILED_ONLY_BEGIN}\**(.*)\/\**\${COMPILED_ONLY_END}\**\//s, '$1');

await exportSourceFileRaw('src/server/Adapters/ICS/Parser/parseParameters.ts', format(code));

console.log("OK: 'src/server/Adapters/ICS/Parser/parseParameters.ts' written");

function compileParserFunction (key: string, type: Type) : string {
    const blocks = sortBlocks(key, type);
    const final = blocks.pop();

    return format(`export function ${fnName(key)}(parameterValue: string) {
        const value = ${compileValueParserFnCall(type)};
        ${format(compileEnumLiteralIfElseBlocks(blocks), 8)}
        
        ${format(compileFinalBlock(final!.key, final!.type), 8)}
    }`);
}

function compileFinalBlock (key: string, type: Type) {
    if (type.allowsAnyString || type.parserFn !== typeCompiler.defaultParserFn.name) {
        return compileTypedReturn(key, type);
    }

    return `${compileEnumLiteralIfBlock(key, type)}
    
            throw new Error(\`Invalid value '\${value}' for parameter '${key}'\`);`
}

function compileEnumLiteralIfElseBlocks (blocks: {key: string, type: Type}[]) {
    return `${blocks.map(({key, type}) => compileEnumLiteralIfBlock(key, type)).join(" else ")}`;
}

function compileEnumLiteralIfBlock (key: string, type: Type) {
    if (type.allowsAnyString || type.enums.length === 0) {
        console.log(`ERROR: Invalid enum if block, either match-all or missing enum literals for key '${key}'`);
        process.exit(1);
    }

    const enums = (type.enums
        .filter(enumValue => typeof enumValue === 'string') as string[])
        .map(value => `'${value}'`);

    return format(`if ([${enums.join(', ')}].includes(value)) {
                ${compileTypedReturn(key, type)}
            }`);
}

function compileTypedReturn (key: string, type: Type) {
    return `return {'${key}': value} as Parameters.${type.name};`;
}

function compileValueParserFnCall (type: Type) : string {
    if (type.isList) {
        return `parameterValue.split(SEMICOLON).map(parameterValue => ${type.parserFn}(parameterValue))`
    } else {
        return `${type.parserFn}(parameterValue)`
    }
}

function compileKeyMatcherBlock(key: string) : string {
    return `case '${key}':
                return parser.${fnName(key)}(parameterValue);
           `
}

function fnName (key: string) : string {
    return `parse${key.replace('-', '_')}`;
}

function sortBlocks (key: string, type: Type, level: number = 0, matchAll: undefined|Type = undefined) : {key: string, type: Type, final: boolean}[] {
    const literals: string[] = [];
    const subs: Type[] = [];

    type.enums.forEach(enumValue => {
        if (typeof enumValue === 'string') literals.push(enumValue);
        else if (typeof enumValue === 'object') subs.push(enumValue);
    });

    if (type.allowsAnyString) {
        if (matchAll !== undefined) {
            console.log(`ERROR: Referenced types for key '${key}' contain multiple match-all types`);
            process.exit(1);
        }

        matchAll = type;
    }

    let blocks: {key: string, type: Type, final: boolean}[] = [{
        key,
        type: {
            ...type,
            enums: literals
        },
        final: false,
    }];


    for (const sub of subs) {
        blocks = [...blocks, ...sortBlocks(key, sub, level + 1, matchAll)];
    }

    return blocks;
}