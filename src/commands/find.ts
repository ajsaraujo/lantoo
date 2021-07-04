import { flags } from '@oclif/command'
import { container } from 'tsyringe'

import { Codebase } from '../modules/i18n/codebase/codebase'
import {
	KeyState,
	TranslationKey,
} from '../modules/i18n/models/translation-key'
import Command from './base'

export default class Find extends Command {
	static description = 'find translation keys'

	static usage = 'find'

	static examples = [
		'$ lantoo find away_female',
		'$ lantoo find --untranslated',
		'$ lantoo find --unused',
		'$ lantoo find --lang pt-BR',
	]

	static args = [
		{ name: 'key', required: false, description: 'a specific key to find' },
	]

	static flags = {
		lang: flags.string({ char: 'l' }),
		json: flags.boolean({ char: 'j' }),
		untranslated: flags.boolean(),
		unused: flags.boolean(),
	}

	private language!: string

	async run(): Promise<void> {
		const { args, flags } = this.parse(Find)

		this.language = await this.parseLanguageOptionOrGetFromPreferences(
			flags.lang,
		)

		if (args.key) {
			await this.findOne(args.key)
		} else if (flags.unused) {
			await this.findUnusedKeys()
		} else {
			await this.findUntranslatedKeys()
		}
	}

	private async findOne(key: string) {
		const codebase: Codebase = container.resolve(Codebase)
		const translationKey = await codebase.getKey(key, this.language)

		if (!translationKey) {
			this.log(`⚠️  ${ key } was not found.`)
		}

		switch (translationKey?.state) {
			case KeyState.Ok:
				this.sayKeyIsOk(translationKey)
				return
			case KeyState.Untranslated:
				this.sayKeyIsUntranslated(translationKey)
				return
			case KeyState.Unused:
				this.sayKeyIsUnused(translationKey)
		}
	}

	private sayKeyIsOk(key: TranslationKey) {
		this.log(
			`\n${ key.key } is OK.\n\n`
        + `✔️  ${ this.formatCodebaseReference(key) }\n`
        + `✔️  It has a translation in ${ this.language }: '${ key.translation }'`,
		)
	}

	private sayKeyIsUntranslated(key: TranslationKey) {
		this.log(`\n⚠️  ${ key.key } is UNTRANSLATED.`)
		this.log(`${ this.formatCodebaseReference(key) }, but it doesn't have a translation in ${ this.language }`)
	}

	private formatCodebaseReference(key: TranslationKey) {
		return `It is referenced in the codebase (found in ${ key.referenceInCodebase })`
	}

	private sayKeyIsUnused(key: TranslationKey) {
		this.log(
			`\n⚠️  ${ key.key } is UNUSED\n\n`
        + `It has a translation in ${ this.language }, but it is not used in the codebase.`,
		)
	}

	private async findUntranslatedKeys() {
		const codebase: Codebase = container.resolve(Codebase)
		const keys = await codebase.getUntranslatedKeys(this.language)

		this.log(
			`Found ${ this.pluralize(keys.length, 'key') } lacking translation in ${
				this.language
			}:`,
		)

		this.listKeys(keys)
	}

	private async findUnusedKeys() {
		const codebase: Codebase = container.resolve(Codebase)
		const keys = await codebase.getUnusedKeys(this.language)

		this.log(
			`Found ${ this.pluralize(keys.length, 'unused key') } in ${
				this.language
			} translation file`,
		)

		this.listKeys(keys)
	}

	private pluralize(count: number, str: string) {
		if (count === 1) {
			return `1 ${ str }`
		}

		return `${ count } ${ str }s`
	}

	private listKeys(keys: TranslationKey[]) {
		for (const translation of keys) {
			this.log(`  - '${ translation.key }'`)
		}
	}
}
