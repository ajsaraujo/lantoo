import * as fs from 'fs-extra'

export interface IFileSystem {
  readJSON(path: string): Promise<unknown[] | Record<string, unknown>>
  writeJSON(path: string, object: any): Promise<void>
}

export class FileSystem implements IFileSystem {
  readJSON(path: string) {
    return fs.readJSON(path)
  }

  writeJSON(path: string, object: any) {
    return fs.writeJSON(path, object)
  }
}
