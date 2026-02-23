import { Transport } from "@/transports/types"
import Logger from "../core/Logger"
import { LogEntry } from "../core/types"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)


class ConsoleTransport implements Transport {
    name: string
    constructor() {
        this.name = 'console'
    }
    log(entry: LogEntry) {
        console.log(entry)
    }
}

interface FileTransportOptions {
    name?: string
    path: string
}

class FileTransport implements Transport {
    name = 'file'
    private path: string

    get filename () {
        return path.join(path.dirname(__filename), 'logs', this.path)
    }

    constructor(options: FileTransportOptions) {
        if (options.name) this.name = options.name
        this.path = options.path

        fs.mkdirSync(path.join(path.dirname(__filename), "logs"), { recursive: true })
    }

    log(entry: LogEntry<unknown>) {
        console.log(entry, this.name)
        fs.writeFileSync(this.filename, JSON.stringify(entry) + "\n", { flag: 'a' })
    }
}

const logger = new Logger({
    transports: [new ConsoleTransport(), new FileTransport({ path: 'file_logs.log' })],
    globalContext: {
        runLate: {
            timeout: 2000
        }
    },
    level: 'trace'
})

logger.fatal('added.new.user', {
    user: {
        id: Date.now(),
        email: 'example@mail.com'
    }
})

