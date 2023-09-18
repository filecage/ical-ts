export default abstract class Property<T = string, P extends {[key: string]: string|string[]|undefined} = Record<string, string|string[]>> {
    public abstract readonly key: string;
    public readonly value: T;
    public readonly parameters: P;
    public readonly isNonStandard: boolean;

    constructor (value: T, parameters: P, isNonStandard: boolean = false) {
        this.value = value;
        this.parameters = parameters;
        this.isNonStandard = isNonStandard;
    }

    toString () : string {
        if (typeof this.value === 'string') {
            return this.value;
        }

        if (typeof this.value?.toString === 'function' && this.value.toString.length === 0) {
            return this.value.toString();
        }

        throw new Error(`Can not convert non-string ICSData.Value to string for property '${this.constructor.name}' (key '${this.key}')`);
    }


}