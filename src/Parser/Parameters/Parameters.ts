import {CalAddress} from "../ValueTypes/CalAddress";
import {Uri} from "../ValueTypes/Uri";
import {LanguageTag} from "../ValueTypes/LanguageTag";
import {EmailAddress} from "../ValueTypes/EmailAddress";

export namespace Parameters {
    // TODO: We could define defaults for all parameters using the @default annotation, see https://github.com/filecage/ical-ts/issues/4

    // @see https://datatracker.ietf.org/doc/html/rfc5545#section-3.2
    // @see https://datatracker.ietf.org/doc/html/rfc7986#section-6
    export type AlternateTextRepresentation = { ALTREP?: CalAddress };
    export type CommonName = { CN?: string };
    export type CalendarUserType = { CUTYPE?: string | 'INDIVIDUAL' | 'GROUP' | 'RESOURCE' | 'ROOM' | 'UNKNOWN' };
    export type Delegators = { 'DELEGATED-FROM'?: CalAddress[] };
    export type Delegatees = { 'DELEGATED-TO'?: CalAddress[] };
    export type DirectoryEntryReference = { DIR?: Uri };
    export type Display = { DISPLAY?: (string | 'BADGE' | 'GRAPHIC' | 'FULLSIZE' | 'THUMBNAIL')[] };
    export type Email = { EMAIL?: EmailAddress };
    export type Feature = { FEATURE?: (string | 'AUDIO' | 'CHAT' | 'FEED' | 'MODERATOR' | 'PHONE' | 'SCREEN' | 'VIDEO')[] };
    export type InlineEncoding = { ENCODING?: '8BIT' | 'BASE64' };
    export type FormatType = { FMTTYPE?: string };
    export type FreeBusyTimeType = { FBTYPE?: string | 'FREE' | 'BUSY' | 'BUSY-UNAVAILABLE' | 'BUSY-TENTATIVE' };
    export type Language = { LANGUAGE?: LanguageTag };
    export type Label = { LABEL?: string };
    export type GroupOrListMembership = { MEMBER?: CalAddress[] };
    export type ParticipationStatusJournal = { PARTSTAT?: string | 'NEEDS-ACTION' | 'ACCEPTED' | 'DECLINED' };
    export type ParticipationStatusEvent = { PARTSTAT?: ParticipationStatusJournal['PARTSTAT'] | 'TENTATIVE' | 'DELEGATED' };
    export type ParticipationStatusTodo = { PARTSTAT?: ParticipationStatusEvent['PARTSTAT'] | 'COMPLETED' | 'IN-PROCESS' };
    export type Range = { RANGE?: 'THISANDFUTURE' };
    export type AlarmTriggerRelationship = { RELATED?: 'START' | 'END' };
    export type RelationshipType = { RELTYPE?: string | 'PARENT' | 'CHILD' | 'SIBLING' | 'SNOOZE' };
    export type ParticipationRole = { ROLE?: string | 'CHAIR' | 'REQ-PARTICIPANT' | 'OPT-PARTICIPANT' | 'NON-PARTICIPANT'};
    export type RSVPExpectation = {RSVP?: 'TRUE' | 'FALSE'};
    export type SentBy = {'SENT-BY'?: CalAddress};
    export type TimeZoneIdentifier = {TZID?: string};
    export type ValueDataTypes = {VALUE?: string | 'BINARY' | 'BOOLEAN' | 'CAL-ADDRESS' | 'DATE' | 'DATE-TIME' | 'DURATION' | 'FLOAT' | 'INTEGER' | 'PERIOD' | 'RECUR' | 'TEXT' | 'TIME' | 'URI' | 'UTC-OFFSET'};
}