export type TypeEnums = (string|Type)[];

export type Type = {
    readonly name: string,
    readonly default: undefined|string,
    readonly allowsAnyString: boolean,
    readonly isList: boolean,
    readonly enums: TypeEnums,
    readonly parserFn: string,
}