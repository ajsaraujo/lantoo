import {
	KeyOccurrence,
	Translation,
	TranslationKey,
} from '../models/translation-key'

/**
 * Given an array of key occurrences and a map of
 * translation keys to values, this class pairs them
 * into an array of unique TranslationKeys
 */
export class KeyAssembler {
	private keys = new Map<string, TranslationKey>()

	constructor(
		private occurrences: KeyOccurrence[],
		private translations: Record<string, Translation>,
	) {}

	assemble(): TranslationKey[] {
		this.combineOccurrencesWithTranslations()
		this.createRemainingKeysFromUnusedTranslations()

		return Array.from(this.keys.values())
	}

	private combineOccurrencesWithTranslations() {
		for (const occurrence of this.occurrences) {
			const { key } = occurrence
			const translation = this.translations[key]

			this.createTranslationKey(key, translation, occurrence)
		}
	}

	private createRemainingKeysFromUnusedTranslations() {
		for (const translation of Object.values(this.translations)) {
			const { key } = translation

			if (this.keys.has(key)) {
				continue
			}

			this.createTranslationKey(key, translation)
		}
	}

	private createTranslationKey(
		key: string,
		translation: Translation,
		occurrence?: KeyOccurrence,
	) {
		const result = TranslationKey.create(translation, occurrence)

		if (result.isSuccess) {
			this.keys.set(key, result.value)
		}
	}
}
