import {Type} from "./Type";
import {ValueParserFn} from "../../src/Parser/parseValues";

export function flattenTypeEnums (type: Type) : {enums: string[], allowsAnyString: boolean} {
    return type.enums.reduce((flatType, enumValue) => {
        if (typeof enumValue === 'string') {
            flatType.enums.push(enumValue);
        } else {
            const delegated = flattenTypeEnums(enumValue);
            flatType.enums = [...flatType.enums, ...delegated.enums];
            flatType.allowsAnyString = flatType.allowsAnyString || delegated.allowsAnyString;
        }

        return flatType;
    }, {enums: [] as string[], allowsAnyString: type.allowsAnyString});
}

export function *flattenTypeParserFns (type: Type, map: {[key: string /*FnName*/]: ValueParserFn}) : Generator<ValueParserFn> {
    const parserFn = map[type.parserFn];
    if (parserFn === undefined) {
        throw new Error(`Can not flatten parser functions, type uses parser function '${type.parserFn}' that has not been mapped`);
    }

    yield parserFn;

    // See if we have nested types and yield them too
    for (const enumValue of type.enums) {
        if (typeof enumValue === 'string') {
            continue;
        }

        yield *flattenTypeParserFns(enumValue, map);
    }
}