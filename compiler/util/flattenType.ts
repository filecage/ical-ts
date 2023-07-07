import {Type} from "../parameters/Type";

export function flattenType (type: Type) : {enums: string[], allowsAnyString: boolean} {
    return type.enums.reduce((flatType, enumValue) => {
        if (typeof enumValue === 'string') {
            flatType.enums.push(enumValue);
        } else {
            const delegated = flattenType(enumValue);
            flatType.enums = [...flatType.enums, ...delegated.enums];
            flatType.allowsAnyString = flatType.allowsAnyString || delegated.allowsAnyString;
        }

        return flatType;
    }, {enums: [] as string[], allowsAnyString: type.allowsAnyString});
}