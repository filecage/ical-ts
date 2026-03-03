import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";
import {ReqStatus} from "../ValueTypes/ReqStatus";

export default class RequestStatus extends Property<ReqStatus, Parameters.Language> {
    public readonly key = 'REQUEST-STATUS';
}