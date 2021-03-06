import { inject, injectable } from 'tsyringe';

import { FuzzyFinder } from './fuzzy-finder';
import validLanguages from './valid-languages';

@injectable()
export class I18n {
	constructor(@inject('FuzzyFinder') private fuzzy: FuzzyFinder) {
		//
	}

	isLanguageCode(str: string): boolean {
		return validLanguages.includes(str);
	}

	findSimilarLanguageCode(language: string): string | undefined {
		return this.fuzzy.search(validLanguages, language);
	}

	fixCasing(languageCode: string): string {
		if (languageCode.includes('-')) {
			const [firstPart, secondPart] = languageCode.split('-');
			return `${ firstPart.toLowerCase() }-${ secondPart.toUpperCase() }`;
		}

		return languageCode.toLowerCase();
	}
}
