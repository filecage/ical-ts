import {DateTime} from "./DateTime";
import {Duration} from "./Duration";

export type Period = {
    start: DateTime,
    end: DateTime
} | {
    start: DateTime,
    duration: Duration
}