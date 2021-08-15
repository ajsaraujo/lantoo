import { injectable } from 'tsyringe'

import { FuzzyFinder } from './fuzzy-finder'
import validLanguages from './valid-languages'

@injectable()
export class LanguageUtils {
	constructor(private fuzzy: FuzzyFinder) {}

	isLanguageCode(str: string): boolean {
		return validLanguages.includes(this.fixCasing(str))
	}

	findSimilarLanguageCode(language: string): string | undefined {
		return this.fuzzy.search(validLanguages, language)
	}

	fixCasing(languageCode: string): string {
		if (languageCode.includes('-')) {
			const [firstPart, secondPart] = languageCode.split('-')
			return `${ firstPart.toLowerCase() }-${ secondPart.toUpperCase() }`
		}

		return languageCode.toLowerCase()
	}
}
