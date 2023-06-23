type StringIndexedObject = {[key: string]: unknown};

export const sortedJSONKeysReplacer = (key: string, value: StringIndexedObject) =>
    value instanceof Object && !(value instanceof Array) ?
        Object.keys(value)
            .sort()
            .reduce((sorted: StringIndexedObject, key) => {
                sorted[key] = value[key];
                return sorted
            }, {}) :
        value;