import { KeyOccurrence } from '../models/translation-key'

export interface ICodeParser {
	getKeyOccurrence(key: string): Promise<KeyOccurrence | undefined>
	getKeyOccurrences(): Promise<KeyOccurrence[]>
}

export class MockCodeParser implements ICodeParser {
	async getKeyOccurrence(key: string): Promise<KeyOccurrence | undefined> {
		const occurrences = await this.getKeyOccurrences()
		return occurrences.find((occurrence) => occurrence.key === key)
	}

	async getKeyOccurrences(): Promise<KeyOccurrence[]> {
		return [
			new KeyOccurrence('Page_title', 'app/message-pin/client/pinMessage.js'),
			new KeyOccurrence('to_infinity_and_beyond', 'src/motivational.js'),
		]
	}
}
