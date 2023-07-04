// THIS FILE IS BEING AUTO GENERATED, DO NOT EDIT!
// @see compiler/parameters/parameters.ts
import {EQUAL, SEMICOLON} from "../ParserConstants";
import {Parameters} from "../Parameters";

export interface ParameterValueParserFn {
    (value: string): string
}

export const parseUriValue: ParameterValueParserFn = (value: string): string => value;
export const parseCalAddressValue: ParameterValueParserFn = (value: string): string => value;
export const parseLanguageTag: ParameterValueParserFn = (value: string): string => value;
export const parseValue: ParameterValueParserFn = (value: string): string => value;

function parseParameters(fragments: string[]) {
    return fragments.map(fragment => {
        const [parameterKey, parameterValue] = fragment.split(EQUAL);

        switch (parameterKey) {
            case 'ALTREP':
                return parser.parseALTREP(parameterValue);

            case 'CN':
                return parser.parseCN(parameterValue);

            case 'CUTYPE':
                return parser.parseCUTYPE(parameterValue);

            case 'DELEGATED-FROM':
                return parser.parseDELEGATED_FROM(parameterValue);

            case 'DELEGATED-TO':
                return parser.parseDELEGATED_TO(parameterValue);

            case 'DIR':
                return parser.parseDIR(parameterValue);

            case 'ENCODING':
                return parser.parseENCODING(parameterValue);

            case 'FMTTYPE':
                return parser.parseFMTTYPE(parameterValue);

            case 'FBTYPE':
                return parser.parseFBTYPE(parameterValue);

            case 'LANGUAGE':
                return parser.parseLANGUAGE(parameterValue);

            case 'MEMBER':
                return parser.parseMEMBER(parameterValue);

            case 'PARTSTAT':
                return parser.parsePARTSTAT(parameterValue);

            case 'RANGE':
                return parser.parseRANGE(parameterValue);

            case 'RELATED':
                return parser.parseRELATED(parameterValue);

            case 'RELTYPE':
                return parser.parseRELTYPE(parameterValue);

            case 'ROLE':
                return parser.parseROLE(parameterValue);

            case 'RSVP':
                return parser.parseRSVP(parameterValue);

            case 'SENT-BY':
                return parser.parseSENT_BY(parameterValue);

            case 'TZID':
                return parser.parseTZID(parameterValue);

            case 'VALUE':
                return parser.parseVALUE(parameterValue);

            default:
                throw new Error(`Invalid parameter '${parameterKey}'`);
        }
    })
}

namespace parser {
    export function parseALTREP(parameterValue: string) {
        const value = parseCalAddressValue(parameterValue);

        return {'ALTREP': value} as Parameters.AlternateTextRepresentation;
    }

    export function parseCN(parameterValue: string) {
        const value = parseValue(parameterValue);

        return {'CN': value} as Parameters.CommonName;
    }

    export function parseCUTYPE(parameterValue: string) {
        const value = parseValue(parameterValue);

        return {'CUTYPE': value} as Parameters.CalendarUserType;
    }

    export function parseDELEGATED_FROM(parameterValue: string) {
        const value = parameterValue.split(SEMICOLON).map(parameterValue => parseCalAddressValue(parameterValue));

        return {'DELEGATED-FROM': value} as Parameters.Delegators;
    }

    export function parseDELEGATED_TO(parameterValue: string) {
        const value = parameterValue.split(SEMICOLON).map(parameterValue => parseCalAddressValue(parameterValue));

        return {'DELEGATED-TO': value} as Parameters.Delegatees;
    }

    export function parseDIR(parameterValue: string) {
        const value = parseUriValue(parameterValue);

        return {'DIR': value} as Parameters.DirectoryEntryReference;
    }

    export function parseENCODING(parameterValue: string) {
        const value = parseValue(parameterValue);

        if (['8BIT', 'BASE64'].includes(value)) {
            return {'ENCODING': value} as Parameters.InlineEncoding;
        }

        throw new Error(`Invalid value '${value}' for parameter 'ENCODING'`);
    }

    export function parseFMTTYPE(parameterValue: string) {
        const value = parseValue(parameterValue);

        return {'FMTTYPE': value} as Parameters.FormatType;
    }

    export function parseFBTYPE(parameterValue: string) {
        const value = parseValue(parameterValue);

        return {'FBTYPE': value} as Parameters.FreeBusyTimeType;
    }

    export function parseLANGUAGE(parameterValue: string) {
        const value = parseLanguageTag(parameterValue);

        return {'LANGUAGE': value} as Parameters.Language;
    }

    export function parseMEMBER(parameterValue: string) {
        const value = parameterValue.split(SEMICOLON).map(parameterValue => parseCalAddressValue(parameterValue));

        return {'MEMBER': value} as Parameters.GroupOrListMembership;
    }

    export function parsePARTSTAT(parameterValue: string) {
        const value = parseValue(parameterValue);
        if (['COMPLETED', 'IN-PROCESS'].includes(value)) {
            return {'PARTSTAT': value} as Parameters.ParticipationStatusTodo;
        } else if (['TENTATIVE', 'DELEGATED'].includes(value)) {
            return {'PARTSTAT': value} as Parameters.ParticipationStatusEvent;
        }

        return {'PARTSTAT': value} as Parameters.ParticipationStatusJournal;
    }

    export function parseRANGE(parameterValue: string) {
        const value = parseValue(parameterValue);

        if (['THISANDFUTURE'].includes(value)) {
            return {'RANGE': value} as Parameters.Range;
        }

        throw new Error(`Invalid value '${value}' for parameter 'RANGE'`);
    }

    export function parseRELATED(parameterValue: string) {
        const value = parseValue(parameterValue);

        if (['START', 'END'].includes(value)) {
            return {'RELATED': value} as Parameters.AlarmTriggerRelationship;
        }

        throw new Error(`Invalid value '${value}' for parameter 'RELATED'`);
    }

    export function parseRELTYPE(parameterValue: string) {
        const value = parseValue(parameterValue);

        return {'RELTYPE': value} as Parameters.RelationshipType;
    }

    export function parseROLE(parameterValue: string) {
        const value = parseValue(parameterValue);

        return {'ROLE': value} as Parameters.ParticipationRole;
    }

    export function parseRSVP(parameterValue: string) {
        const value = parseValue(parameterValue);

        if (['TRUE', 'FALSE'].includes(value)) {
            return {'RSVP': value} as Parameters.RSVPExpectation;
        }

        throw new Error(`Invalid value '${value}' for parameter 'RSVP'`);
    }

    export function parseSENT_BY(parameterValue: string) {
        const value = parseCalAddressValue(parameterValue);

        return {'SENT-BY': value} as Parameters.SentBy;
    }

    export function parseTZID(parameterValue: string) {
        const value = parseValue(parameterValue);

        return {'TZID': value} as Parameters.TimeZoneIdentifier;
    }

    export function parseVALUE(parameterValue: string) {
        const value = parseValue(parameterValue);

        return {'VALUE': value} as Parameters.ValueDataTypes;
    }
}