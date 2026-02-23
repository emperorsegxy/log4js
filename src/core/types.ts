export type LogLevel =
  | 'trace'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal'

export interface LogEntry<TContext = unknown> {
  id: string
  level: LogLevel
  event: string
  timestamp: number
  context?: TContext
}