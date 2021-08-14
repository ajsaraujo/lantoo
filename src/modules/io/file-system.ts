import * as fs from 'fs-extra'
import { singleton } from 'tsyringe'

type JSON = unknown[] | Record<string, unknown>

@singleton()
export class FileSystem {
	getFileNames(folderPath: string): Promise<string[]> {
		return fs.readdir(folderPath)
	}

	readJSON(path: string): Promise<JSON | undefined> {
		return fs.readJSON(path)
	}

	writeJSON(path: string, object: JSON): Promise<any> {
		const INDENTATION_SIZE = 2;
		const NEW_LINE = '\n';
		const formattedJSON = JSON.stringify(object, null, INDENTATION_SIZE) + NEW_LINE;

		return fs.writeFile(path, formattedJSON);
	}

	ensureDirectoryExists(path: string): Promise<void> {
		return fs.ensureDir(path);
	}
}
