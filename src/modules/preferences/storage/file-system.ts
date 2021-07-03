import * as fs from 'fs-extra';

export interface IFileSystem {
	readJSON(path: string): Promise<any>
	writeJSON(path: string, object: any): Promise<any>
}

export class FileSystem implements IFileSystem {
	readJSON(path: string): Promise<any> {
		return fs.readJSON(path);
	}

	writeJSON(path: string, object: [] | Record<string, unknown>): Promise<any> {
		return fs.writeJSON(path, object);
	}
}
