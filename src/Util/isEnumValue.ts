export default function isEnumValue<T extends object>(enumerated: T, token: unknown) : token is T[keyof T] {
    return Object.values(enumerated).includes(token as T[keyof T]);
}