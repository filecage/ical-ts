import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";

export default class RelatedTo extends Property<string, Parameters.RelationshipType> {
    public readonly key = 'RELATED-TO';
}