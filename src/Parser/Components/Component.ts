import CalendarIterator from "../CalendarIterator";
import {ICS} from "../../ICS";
import {BEGIN, END, LIST_PROPERTIES, Property as EProperty} from "../Constants";
import {parseProperty} from "../parseProperties";
import Property from "../Properties/Property";
import {ComponentName} from "./ComponentName";

export type ContextValue = Property<unknown>|Component|undefined;
export type Context = {[key: string]: ContextValue|ContextValue[]|Context|Context[]};

export default abstract class Component<S extends object = Context> {
    public abstract readonly key: ComponentName;
    private readonly childComponents: { [key: string]: Component };

    constructor(allowedChildComponents: Component[]) {
        this.childComponents = allowedChildComponents.reduce((childComponents, component) => {
            return {...childComponents, [component.key]: component};
        }, {});
    }

    /**
     * This method gets the parsed context (properties and subcomponents) and has to pick
     * or throw for mandatory properties/components.
     *
     * @param context
     * @protected
     */
    protected abstract build(context: Context): S;

    parse(calendar: CalendarIterator): S {
        let closed = false;
        const context: Context = {};
        for (const {name, value} of calendar.iterate()) {
            if (name === BEGIN) {
                const component = this.childComponents[value];
                if (component === undefined) {
                    throw new Error(`Unexpected sub-component '${value}' not allowed in component '${this.key}'`);
                }

                if (context[component.key] === undefined) {
                    context[component.key] = [];
                }

                (context[component.key] as Context[]).push(component.parse(calendar));
            } else if (name === END) {
                if (value as ComponentName !== this.key) {
                    throw new Error(`Unexpected 'END:${value}' in component '${this.key}'`);
                }

                closed = true;
            } else {
                const property = parseProperty(name, value);
                if (LIST_PROPERTIES.includes(property.key as EProperty)) {
                    if (context[property.key] === undefined) {
                        context[property.key] = [];
                    }

                    (context[property.key] as Property<unknown>[]).push(property);
                } else {
                    if (context[property.key] !== undefined) {
                        throw new Error(`Non-list property '${property.key}' appeared twice in component '${this.key}'`);
                    }

                    context[property.key] = property;
                }
            }
        }

        // All components apart from ROOT have to be closed properly
        if (!closed && this.key !== ComponentName.ROOT) {
            throw new Error(`Unexpected EOF: missing END declaration for component '${this.key}'`);
        }

        return this.build(context);
    }

    protected pickOrThrow<T = Property | Component>(data: Context, name: string): T {
        if (data[name] === undefined) {
            throw new Error(`Missing mandatory key '${name}'`);
        }

        return data[name] as T;
    }

    protected pick<T = Property>(data: { [key: string]: unknown }, key: string): T | undefined {
        if (data[key] === undefined) {
            return undefined;
        }

        return data[key] as T;
    }

    protected pickNonStandardProperties(data: { [key: string]: unknown }): ICS.NonStandardPropertyAware {
        const nonStandardPropertyData: { [key: string]: Property } = {};
        for (const [key, value] of Object.entries(data)) {
            if (key.startsWith('X-') && value instanceof Property) {
                nonStandardPropertyData[key] = value as Property;
            }
        }

        return nonStandardPropertyData;
    }

}