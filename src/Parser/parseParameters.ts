
// THIS FILE IS BEING AUTO GENERATED, DO NOT EDIT!
// @see compiler/parameters.ts
import {EQUAL, SEMICOLON} from "./Constants";
import {Parameters} from "./Parameters/Parameters";

import {parseValueRaw} from "./parseValues"

export function parseParameters (fragments: string[])  : Parameters.AlternateTextRepresentation&Parameters.CommonName&Parameters.CalendarUserType&Parameters.Delegators&Parameters.Delegatees&Parameters.DirectoryEntryReference&Parameters.Display&Parameters.Email&Parameters.Feature&Parameters.InlineEncoding&Parameters.FormatType&Parameters.FreeBusyTimeType&Parameters.Language&Parameters.Label&Parameters.GroupOrListMembership&Parameters.ParticipationStatusTodo&Parameters.Range&Parameters.AlarmTriggerRelationship&Parameters.RelationshipType&Parameters.ParticipationRole&Parameters.RSVPExpectation&Parameters.SentBy&Parameters.TimeZoneIdentifier&Parameters.ValueDataTypes {
    return fragments.reduce((parameters, fragment) => {
        const [parameterKey, parameterValue] = fragment.split(EQUAL);

        switch (parameterKey) {
            case 'ALTREP': return {...parameters, ...parser.parseALTREP(parameterValue)};
            case 'CN': return {...parameters, ...parser.parseCN(parameterValue)};
            case 'CUTYPE': return {...parameters, ...parser.parseCUTYPE(parameterValue)};
            case 'DELEGATED-FROM': return {...parameters, ...parser.parseDELEGATED_FROM(parameterValue)};
            case 'DELEGATED-TO': return {...parameters, ...parser.parseDELEGATED_TO(parameterValue)};
            case 'DIR': return {...parameters, ...parser.parseDIR(parameterValue)};
            case 'DISPLAY': return {...parameters, ...parser.parseDISPLAY(parameterValue)};
            case 'EMAIL': return {...parameters, ...parser.parseEMAIL(parameterValue)};
            case 'FEATURE': return {...parameters, ...parser.parseFEATURE(parameterValue)};
            case 'ENCODING': return {...parameters, ...parser.parseENCODING(parameterValue)};
            case 'FMTTYPE': return {...parameters, ...parser.parseFMTTYPE(parameterValue)};
            case 'FBTYPE': return {...parameters, ...parser.parseFBTYPE(parameterValue)};
            case 'LANGUAGE': return {...parameters, ...parser.parseLANGUAGE(parameterValue)};
            case 'LABEL': return {...parameters, ...parser.parseLABEL(parameterValue)};
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
                    return {...parameters, [parameterKey]: parseValueRaw(parameterValue)};
                }

                throw new Error(`Invalid parameter '${parameterKey}'`);
        }
    }, {});
}

namespace parser {
    export function parseALTREP(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        return {'ALTREP': value} as Parameters.AlternateTextRepresentation;
    }
    
    export function parseCN(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        return {'CN': value} as Parameters.CommonName;
    }
    
    export function parseCUTYPE(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        return {'CUTYPE': value} as Parameters.CalendarUserType;
    }
    
    export function parseDELEGATED_FROM(parameterValue: string) {
        const value = parameterValue.split(SEMICOLON).map(parameterValue => parseValueRaw(parameterValue));
        
        return {'DELEGATED-FROM': value} as Parameters.Delegators;
    }
    
    export function parseDELEGATED_TO(parameterValue: string) {
        const value = parameterValue.split(SEMICOLON).map(parameterValue => parseValueRaw(parameterValue));
        
        return {'DELEGATED-TO': value} as Parameters.Delegatees;
    }
    
    export function parseDIR(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        return {'DIR': value} as Parameters.DirectoryEntryReference;
    }
    
    export function parseDISPLAY(parameterValue: string) {
        const value = parameterValue.split(SEMICOLON).map(parameterValue => parseValueRaw(parameterValue));
        
        return {'DISPLAY': value} as Parameters.Display;
    }
    
    export function parseEMAIL(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        return {'EMAIL': value} as Parameters.Email;
    }
    
    export function parseFEATURE(parameterValue: string) {
        const value = parameterValue.split(SEMICOLON).map(parameterValue => parseValueRaw(parameterValue));
        
        return {'FEATURE': value} as Parameters.Feature;
    }
    
    export function parseENCODING(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        if (['8BIT', 'BASE64'].includes(value)) {
            return {'ENCODING': value} as Parameters.InlineEncoding;
        }
            
        throw new Error(`Invalid value '${value}' for parameter 'ENCODING'`);
    }
    
    export function parseFMTTYPE(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        return {'FMTTYPE': value} as Parameters.FormatType;
    }
    
    export function parseFBTYPE(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        return {'FBTYPE': value} as Parameters.FreeBusyTimeType;
    }
    
    export function parseLANGUAGE(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        return {'LANGUAGE': value} as Parameters.Language;
    }
    
    export function parseLABEL(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        return {'LABEL': value} as Parameters.Label;
    }
    
    export function parseMEMBER(parameterValue: string) {
        const value = parameterValue.split(SEMICOLON).map(parameterValue => parseValueRaw(parameterValue));
        
        return {'MEMBER': value} as Parameters.GroupOrListMembership;
    }
    
    export function parsePARTSTAT(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        if (['COMPLETED', 'IN-PROCESS'].includes(value)) {
            return {'PARTSTAT': value} as Parameters.ParticipationStatusTodo;
        } else if (['TENTATIVE', 'DELEGATED'].includes(value)) {
            return {'PARTSTAT': value} as Parameters.ParticipationStatusEvent;
        }
        
        return {'PARTSTAT': value} as Parameters.ParticipationStatusJournal;
    }
    
    export function parseRANGE(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        if (['THISANDFUTURE'].includes(value)) {
            return {'RANGE': value} as Parameters.Range;
        }
            
        throw new Error(`Invalid value '${value}' for parameter 'RANGE'`);
    }
    
    export function parseRELATED(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        if (['START', 'END'].includes(value)) {
            return {'RELATED': value} as Parameters.AlarmTriggerRelationship;
        }
            
        throw new Error(`Invalid value '${value}' for parameter 'RELATED'`);
    }
    
    export function parseRELTYPE(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        return {'RELTYPE': value} as Parameters.RelationshipType;
    }
    
    export function parseROLE(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        return {'ROLE': value} as Parameters.ParticipationRole;
    }
    
    export function parseRSVP(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        if (['TRUE', 'FALSE'].includes(value)) {
            return {'RSVP': value} as Parameters.RSVPExpectation;
        }
            
        throw new Error(`Invalid value '${value}' for parameter 'RSVP'`);
    }
    
    export function parseSENT_BY(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        return {'SENT-BY': value} as Parameters.SentBy;
    }
    
    export function parseTZID(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        return {'TZID': value} as Parameters.TimeZoneIdentifier;
    }
    
    export function parseVALUE(parameterValue: string) {
        const value = parseValueRaw(parameterValue);
        
        return {'VALUE': value} as Parameters.ValueDataTypes;
    }
}