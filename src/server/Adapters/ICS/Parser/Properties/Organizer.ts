import Property from "../Property";
import {Parameters} from "../../Parameters";
import {CalAddress} from "../ValueTypes/CalAddress";

export default class Organizer extends Property<CalAddress,
    Parameters.Language &
    Parameters.CommonName &
    Parameters.DirectoryEntryReference &
    Parameters.SentBy
> {
    public readonly key = 'ORGANIZER';
}