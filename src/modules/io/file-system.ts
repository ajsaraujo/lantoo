import * as fs from 'fs-extra'
import { singleton } from 'tsyringe'

type JSON = unknown[] | Record<string, unknown>

@singleton()
export class FileSystem {
	readJSON(path: string): Promise<JSON> {
		return fs.readJSON(path)
	}

	writeJSON(path: string, object: JSON): Promise<any> {
		const INDENTATION_SIZE = 2;
		const NEW_LINE = '\n';
		const formattedJSON = JSON.stringify(object, Object.keys(object).sort(), INDENTATION_SIZE) + NEW_LINE;

		return fs.writeFile(path, formattedJSON);
	}

	ensureDirectoryExists(path: string): Promise<void> {
		return fs.ensureDir(path);
	}
}
