/**
 * The translation progress for a given language.
 */
export class TranslationProgress {
	public static stringsKnown = 1

	constructor(
		public readonly language: string,
		public readonly translatedStrings: number,
	) {
		if (translatedStrings > TranslationProgress.stringsKnown) {
			TranslationProgress.stringsKnown = translatedStrings
		}
	}

	get percentageOfStringsTranslated(): number {
		return this.translatedStrings / TranslationProgress.stringsKnown
	}
}
