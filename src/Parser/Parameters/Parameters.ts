
export namespace Parameters {
    // TODO: These types could be replaced with something that actually helps accessing the data
    type Uri = string;
    type CalAddress = string;
    type LanguageTag = string;

    // @see https://datatracker.ietf.org/doc/html/rfc5545#section-3.2
    export type AlternateTextRepresentation = { ALTREP?: CalAddress };
    export type CommonName = { CN?: string };
    export type CalendarUserType = { CUTYPE?: string | 'INDIVIDUAL' | 'GROUP' | 'RESOURCE' | 'ROOM' | 'UNKNOWN' };
    export type Delegators = { 'DELEGATED-FROM'?: CalAddress[] };
    export type Delegatees = { 'DELEGATED-TO'?: CalAddress[] };
    export type DirectoryEntryReference = { DIR?: Uri };
    export type InlineEncoding = { ENCODING?: '8BIT' | 'BASE64' };
    export type FormatType = { FMTTYPE?: string };
    export type FreeBusyTimeType = { FBTYPE?: string | 'FREE' | 'BUSY' | 'BUSY-UNAVAILABLE' | 'BUSY-TENTATIVE' };
    export type Language = { LANGUAGE?: LanguageTag };
    export type GroupOrListMembership = { MEMBER?: CalAddress[] };
    export type ParticipationStatusJournal = { PARTSTAT?: string | 'NEEDS-ACTION' | 'ACCEPTED' | 'DECLINED' };
    export type ParticipationStatusEvent = { PARTSTAT?: ParticipationStatusJournal['PARTSTAT'] | 'TENTATIVE' | 'DELEGATED' };
    export type ParticipationStatusTodo = { PARTSTAT?: ParticipationStatusEvent['PARTSTAT'] | 'COMPLETED' | 'IN-PROCESS' };
    export type Range = { RANGE?: 'THISANDFUTURE' };
    export type AlarmTriggerRelationship = { RELATED?: 'START' | 'END' };

    // /** @default PARENT */
    export type RelationshipType = { RELTYPE?: string | 'PARENT' | 'CHILD' | 'SIBLING' | 'SNOOZE' };
    export type ParticipationRole = { ROLE?: string | 'CHAIR' | 'REQ-PARTICIPANT' | 'OPT-PARTICIPANT' | 'NON-PARTICIPANT'};
    export type RSVPExpectation = {RSVP?: 'TRUE' | 'FALSE'};
    export type SentBy = {'SENT-BY'?: CalAddress};
    export type TimeZoneIdentifier = {TZID?: string};
    export type ValueDataTypes = {VALUE?: string | 'BINARY' | 'BOOLEAN' | 'CAL-ADDRESS' | 'DATE' | 'DATE-TIME' | 'DURATION' | 'FLOAT' | 'INTEGER' | 'PERIOD' | 'RECUR' | 'TEXT' | 'TIME' | 'URI' | 'UTC-OFFSET'};
}