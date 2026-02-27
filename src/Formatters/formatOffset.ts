import {HYPHEN_MINUS, PLUS} from "../Parser/Constants";

/**
 * This function takes an offset in seconds and formats it to the
 * RFC5455 Offset format
 *
 * @param {number} offsetInSeconds
 * @return string
 */
export default function formatOffset (offsetInSeconds: number) : string {
    const absoluteOffsetMs = Math.abs(offsetInSeconds);
    const hours = Math.floor(absoluteOffsetMs / 3600);
    const minutes = Math.floor(absoluteOffsetMs % 3600 / 60);
    const seconds = Math.floor(absoluteOffsetMs % 60);


    return `${offsetInSeconds < 0 ? HYPHEN_MINUS : PLUS}`
        + `${hours.toString().padStart(2, '0')}`
        + `${minutes.toString().padStart(2, '0')}`
        + `${seconds > 0 ? seconds.toString().padStart(2, '0') : ''}`
    ;
}