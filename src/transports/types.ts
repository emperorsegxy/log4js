import { LogEntry } from "@/core/types";

export interface Transport {
    name: string
    log: (entry: LogEntry) => void | Promise<void>
}