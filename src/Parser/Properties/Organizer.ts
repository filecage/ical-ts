import Property from "./Property";
import {Parameters} from "../Parameters/Parameters";
import {CalAddress} from "../ValueTypes/CalAddress";

export default class Organizer extends Property<CalAddress,
    Parameters.Language &
    Parameters.CommonName &
    Parameters.DirectoryEntryReference &
    Parameters.SentBy &
    Parameters.Email &
    Parameters.ScheduleAgent &
    Parameters.ScheduleStatus &
    Parameters.ScheduleForceSend
> {
    public readonly key = 'ORGANIZER';
}