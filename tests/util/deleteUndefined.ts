/**
 * This function works by reference but also returns the object for easier chaining
 */
export function deleteUndefined<T extends { [k: string]: unknown }> (object: T) : T {
    Object.keys(object).forEach(key => object[key] === undefined && delete object[key]);

    return object;
}