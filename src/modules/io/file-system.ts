import * as fs from 'fs-extra'

type JSON = unknown[] | Record<string, unknown>

export interface IFileSystem {
	readJSON(path: string): Promise<JSON>
	writeJSON(path: string, object: any): Promise<void>
}

export class FileSystem implements IFileSystem {
	readJSON(path: string): Promise<JSON> {
		return fs.readJSON(path)
	}

	writeJSON(path: string, object: JSON): Promise<any> {
		return fs.writeJSON(path, object)
	}
}

export class MockFileSystem implements IFileSystem {
	json: any

	readJSON(_: string): Promise<any> {
		return this.json
	}

	writeJSON(_: string, __: JSON): Promise<any> {
		return this.json
	}
}
