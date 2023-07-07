
// THIS FILE IS BEING AUTO GENERATED, DO NOT EDIT!
// @see compiler/parameters/parameters.ts
import {EQUAL, SEMICOLON} from "../ParserConstants";
import {Parameters} from "../Parameters";

// TODO: Replace these with the shared value parsers
export function parseUriValue (value: string): string {
    return value;
}

export function parseCalAddressValue (value: string) : string {
    return value;
}

export function parseLanguageTag (value: string) : string {
    return value;
}

export function parseValue (value: string): string {
    return value;
}

export function parseParameters (fragments: string[])  : Parameters.AlternateTextRepresentation&Parameters.CommonName&Parameters.CalendarUserType&Parameters.Delegators&Parameters.Delegatees&Parameters.DirectoryEntryReference&Parameters.InlineEncoding&Parameters.FormatType&Parameters.FreeBusyTimeType&Parameters.Language&Parameters.GroupOrListMembership&Parameters.ParticipationStatusTodo&Parameters.Range&Parameters.AlarmTriggerRelationship&Parameters.RelationshipType&Parameters.ParticipationRole&Parameters.RSVPExpectation&Parameters.SentBy&Parameters.TimeZoneIdentifier&Parameters.ValueDataTypes {
    return fragments.reduce((parameters, fragment) => {
        const [parameterKey, parameterValue] = fragment.split(EQUAL);

        switch (parameterKey) {
            case 'ALTREP': return {...parameters, ...parser.parseALTREP(parameterValue)};
            case 'CN': return {...parameters, ...parser.parseCN(parameterValue)};
            case 'CUTYPE': return {...parameters, ...parser.parseCUTYPE(parameterValue)};
            case 'DELEGATED-FROM': return {...parameters, ...parser.parseDELEGATED_FROM(parameterValue)};
            case 'DELEGATED-TO': return {...parameters, ...parser.parseDELEGATED_TO(parameterValue)};
            case 'DIR': return {...parameters, ...parser.parseDIR(parameterValue)};
            case 'ENCODING': return {...parameters, ...parser.parseENCODING(parameterValue)};
            case 'FMTTYPE': return {...parameters, ...parser.parseFMTTYPE(parameterValue)};
            case 'FBTYPE': return {...parameters, ...parser.parseFBTYPE(parameterValue)};
            case 'LANGUAGE': return {...parameters, ...parser.parseLANGUAGE(parameterValue)};
            case 'MEMBER': return {...parameters, ...parser.parseMEMBER(parameterValue)};
            case 'PARTSTAT': return {...parameters, ...parser.parsePARTSTAT(parameterValue)};
            case 'RANGE': return {...parameters, ...parser.parseRANGE(parameterValue)};
            case 'RELATED': return {...parameters, ...parser.parseRELATED(parameterValue)};
            case 'RELTYPE': return {...parameters, ...parser.parseRELTYPE(parameterValue)};
            case 'ROLE': return {...parameters, ...parser.parseROLE(parameterValue)};
            case 'RSVP': return {...parameters, ...parser.parseRSVP(parameterValue)};
            case 'SENT-BY': return {...parameters, ...parser.parseSENT_BY(parameterValue)};
            case 'TZID': return {...parameters, ...parser.parseTZID(parameterValue)};
            case 'VALUE': return {...parameters, ...parser.parseVALUE(parameterValue)};

            default:
                if (parameterKey.startsWith('X-') || parameterKey.startsWith('IANA-')) {
                    return {...parameters, [parameterKey]: parseValue(parameterValue)};
                }

                throw new Error(`Invalid parameter '${parameterKey}'`);
        }
    }, {});
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