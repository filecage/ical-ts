import Property from "./Properties/Property";

export default class PropertyList {
    private propertyList: Property<unknown>[] = [];
    private nonStandardPropertyList: Property<unknown>[] = [];

    push (property: Property<unknown>) {
        if (property.isNonStandard) {
            this.nonStandardPropertyList.push(property);
        } else {
            this.propertyList.push(property);
        }
    }

    toJSON () {
        return [...this.propertyList, ...this.nonStandardPropertyList];
    }

    containsNonStandard () {
        return this.nonStandardPropertyList.length > 0;
    }

    get properties () {
        return this.propertyList;
    }

    get nonStandardProperties () {
        return this.nonStandardPropertyList;
    }

}