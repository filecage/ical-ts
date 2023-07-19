import {DateTime} from "./DateTime";
import {Duration} from "./Duration";
import {XOR} from "ts-xor";

export type Period = {
    start: DateTime
} & XOR<
    {end: DateTime},
    {duration: Duration}
>;