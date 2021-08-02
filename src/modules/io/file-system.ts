import * as fs from 'fs-extra'
import { singleton } from 'tsyringe'

type JSON = unknown[] | Record<string, unknown>

@singleton()
export class FileSystem {
	readJSON(path: string): Promise<JSON> {
		return fs.readJSON(path)
	}

	writeJSON(path: string, object: JSON): Promise<any> {
		return fs.writeJSON(path, object)
	}
}