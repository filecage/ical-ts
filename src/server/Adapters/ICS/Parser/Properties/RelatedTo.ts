import Property from "../Property";
import {Parameters} from "../../Parameters";

export default class RelatedTo extends Property<string, Parameters.RelationshipType> {
    public readonly key = 'RELATED-TO';
}