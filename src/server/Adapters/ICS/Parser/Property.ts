export default abstract class Property<T = string, P extends {[key: string]: string|string[]} = {}> {
    public abstract readonly key: string;
    public readonly value: T;
    public readonly parameters: P;

    constructor (value: T, parameters: P) {
        this.value = value;
        this.parameters = parameters;
    }

    toString () : string {
        if (typeof this.value !== 'string') {
            throw new Error("Can not convert non-string ICSData.Value to string");
        }

        return this.value;
    }

    toJSON () : object|string {
        // If we have no parameters we also don't export them to JSON
        if (Object.keys(this.parameters).length === 0) {
            return this.toString();
        }

        return {
            key: this.key,
            __value__: this.value,
            ...this.parameters
        };
    }

}