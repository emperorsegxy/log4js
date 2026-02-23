import { LogEntry, LogLevel } from "@/core/types";
import { Transport } from "./types";

type ConsoleMethod = 'trace' | 'debug' | 'log' | 'warn' | 'error'

export default class ConsoleTransport implements Transport {
    name = 'console'

    private levelConsoleMethod: Record<LogLevel, ConsoleMethod> = {
        trace: "trace",
        debug: "debug",
        info: "log",
        warn: "warn",
        error: "error",
        fatal: "error"
    }

    log(entry: LogEntry) {
        const method = this.levelConsoleMethod[entry.level]
        console[method](this.name, entry)
    }
}