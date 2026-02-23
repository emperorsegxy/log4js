import { Transport } from "@/transports/types";
import { LogEntry, LogLevel } from "./types";

export interface LoggerOptions {
    level?: LogLevel
    transports: Transport[]
    globalContext?: Record<string, unknown>,
    generateId?: () => string
}

const LEVELS: LogLevel[] = [
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal'
]

export default class Logger {
    private level: LogLevel;
    private transports: Transport[];
    private globalContext: Record<string, unknown>
    private generateId: () => string

    constructor(options?: LoggerOptions) {
        this.level = options?.level ?? 'info'
        this.transports = options?.transports ?? []
        this.globalContext = options?.globalContext ?? {}
        this.generateId = options?.generateId ?? (() => Math.random().toString(36).slice(2))
    }

    private shouldLog(level: LogLevel) {
        return LEVELS.indexOf(level) >= LEVELS.indexOf(this.level)
    }

    private async emit(level: LogLevel, event: string, context?: unknown) {
        if (!this.shouldLog(level)) return

        const logEntry: LogEntry = {
            event,
            id: this.generateId(),
            level,
            timestamp: Date.now(),
            context: {
                ...this.globalContext,
                ...(context as object)
            }
        }

        for (const transport of this.transports) {
            await transport.log(logEntry)
        }
    }

    trace(e: string, c?: unknown) { this.emit('trace', e, c) }
    debug(e: string, c?: unknown) { this.emit('debug', e, c) }
    info(e: string, c?: unknown) { this.emit('info', e, c) }
    warn(e: string, c?: unknown) { this.emit('warn', e, c) }
    error(e: string, c?: unknown) { this.emit('error', e, c) }
    fatal(e: string, c?: unknown) { this.emit('fatal', e, c) }
}