import { Result } from '../../utils'

export enum KeyState {
	Ok,
	Unused,
	Untranslated,
}

export class KeyOccurrence {
	constructor(public readonly key: string, public readonly file: string) {}
}

export class Translation {
	constructor(public readonly key: string, public readonly value: string) {}
}

export class TranslationKey {
	public state: KeyState

	public key: string

	public referenceInCodebase?: string

	public translation?: string

	private constructor(translation?: Translation, occurrence?: KeyOccurrence) {
		this.key = (translation?.key || occurrence?.key) as string
		this.referenceInCodebase = occurrence?.file
		this.translation = translation?.value
		this.state = this.computeState(translation, occurrence)
	}

	/**
   * Returns a failing result if both Translation and
   * KeyOccurrence are falsy, and the TranslationKey
   * otherwise.
   */
	static create(
		translation?: Translation,
		occurrence?: KeyOccurrence,
	): Result<TranslationKey> {
		if (!translation && !occurrence) {
			return Result.fail(
				'Expected one of translation or occurrence to be passed, but both are undefined',
			)
		}

		return Result.ok(new TranslationKey(translation, occurrence))
	}

	get isUnused() {
		return this.state === KeyState.Unused
	}

	get isUntranslated() {
		return this.state === KeyState.Untranslated
	}

	private computeState(translation?: Translation, occurrence?: KeyOccurrence) {
		if (translation && occurrence) {
			return KeyState.Ok
		}

		if (translation && !occurrence) {
			return KeyState.Unused
		}

		return KeyState.Untranslated
	}
}
