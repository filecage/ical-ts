import ts from 'typescript';
import {Type, TypeEnums} from "./Type";
import {ValueParserFn} from "../../src/Parser/parseValues";

export default class TypeCompiler {
    public readonly defaultParserFn;
    private readonly valueParserMap;

    // We store all handled types in here in case we need to reference them again
    private typeMap: {[key: string]: Type} = {};

    constructor(defaultParserFn: ValueParserFn, valueParserMap: {[key: string]: ValueParserFn}) {
        this.defaultParserFn = defaultParserFn;
        this.valueParserMap = valueParserMap;
    }

    handleType(type: ts.TypeNode, name: string, defaultValue: string|undefined) : Type {
        let enums: TypeEnums = [];
        let allowsAnyString = false;
        let isList = false;
        let parserFn = this.defaultParserFn.name;

        switch (type.kind) {
            case ts.SyntaxKind.StringKeyword:
                allowsAnyString = true;
                break;

            case ts.SyntaxKind.NumberKeyword:
                allowsAnyString = true;
                parserFn = this.valueParserMap['__number']?.name || this.defaultParserFn.name;
                break;

            case ts.SyntaxKind.LiteralType:
                const literal = (type as ts.LiteralTypeNode).literal;
                enums.push((literal as ts.LiteralExpression).text);
                break;

            case ts.SyntaxKind.IndexedAccessType:
                // TODO: This does not consider the actual key that's being used. If parameters have more than key at some point, this might fail
                enums.push(this.handleType((type as ts.IndexedAccessTypeNode).objectType, name, undefined));
                break;

            case ts.SyntaxKind.TypeReference:
                let reference: ts.Node = (type as ts.TypeReferenceNode).typeName;
                // Qualified names need to be resolved first
                if (reference.kind === ts.SyntaxKind.QualifiedName) {
                    const {left, right} = reference as ts.QualifiedName;
                    if ((left as ts.Identifier).text !== 'Parameters') {
                        console.log(`ERROR: Unexpected qualified name type reference for parameter '${name}': Can only handle identifiers from 'Parameter' entity`);
                        process.exit(1);
                    }

                    reference = right;
                }

                if (reference.kind !== ts.SyntaxKind.Identifier) {
                    console.log(`ERROR: Unexpected type reference '${reference.kind}' for parameter '${name}'`);
                    process.exit(1);
                }

                const typeName = (reference as ts.Identifier).text;
                // First, look up whether this is a type we've parsed before
                if (this.typeMap[typeName]) {
                    return this.typeMap[typeName];
                }

                // If not, see if this is a type that has a parser registered to it
                if (this.valueParserMap[typeName]) {
                    parserFn = this.valueParserMap[typeName].name;
                } else {
                    console.log(`ERROR: Unresolvable type reference '${typeName}' for parameter '${name}'. Either missing a value parser definition or wrong order of types (references must be declared first).`);
                    process.exit(1);
                }

                break;

            case ts.SyntaxKind.UnionType:
                (type as ts.UnionTypeNode).types.forEach(type => {
                    const delegated = this.handleType(type, name, undefined);
                    enums = [...enums, ...delegated.enums];
                    allowsAnyString = allowsAnyString || delegated.allowsAnyString;
                });
                break;

            case ts.SyntaxKind.ArrayType:
                const delegated = this.handleType((type as ts.ArrayTypeNode).elementType, name, undefined);
                enums = delegated.enums;
                allowsAnyString = delegated.allowsAnyString;
                parserFn = delegated.parserFn;
                isList = true;
                break;

            default:
                console.log(`WARN: Unexpected type property kind '${type.kind}' for parameter '${name}'`);
                break;
        }

        if (!allowsAnyString && defaultValue !== undefined && !this.flattenEnums(enums).includes(defaultValue)) {
            console.log(`ERROR: Non-catch-all parameter '${name}' has default value '${defaultValue}' that can not be assigned to type`);
            process.exit(1);
        }


        return this.typeMap[name] = {name, enums, allowsAnyString, isList, parserFn, default: defaultValue};
    }

    private flattenEnums (enums: TypeEnums) : string[] {
        return enums.map(thisEnum => typeof thisEnum === 'string' ? thisEnum : this.flattenEnums(thisEnum.enums)).flat();
    }
}