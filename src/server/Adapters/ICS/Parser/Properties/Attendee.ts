import Property from "./Property";
import {Parameters} from "../../Parameters";
import {CalAddress} from "../ValueTypes/CalAddress";

export default class Attendee extends Property<CalAddress,
    Parameters.Language &
    Parameters.CalendarUserType &
    Parameters.GroupOrListMembership &
    Parameters.ParticipationRole &
    (Parameters.ParticipationStatusTodo | Parameters.ParticipationStatusJournal | Parameters.ParticipationStatusEvent) &
    Parameters.RSVPExpectation &
    Parameters.Delegatees &
    Parameters.Delegators &
    Parameters.SentBy &
    Parameters.CommonName &
    Parameters.DirectoryEntryReference
> {
    public readonly key = 'ATTENDEE';
}