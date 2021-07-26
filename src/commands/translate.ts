/* eslint-disable no-await-in-loop */
import { flags } from '@oclif/parser'
import { container } from 'tsyringe'
import * as inquirer from 'inquirer';

import { Codebase } from '../modules/i18n/codebase/codebase';
import { ITranslationFiles } from '../modules/i18n/codebase/translation-files';
import Command from './base'

export default class Translate extends Command {
	static description = 'add new translations'

	static usage = 'translate --key Away_female --value Ausente'

	static examples = [
		'$ lantoo translate --key Away_female --value Ausente',
		'$ lantoo translate --interactive',
		'$ lantoo translate --interactive --lang en',
	]

	static flags = {
		lang: flags.string({ char: 'l' }),
		key: flags.string({ char: 'k' }),
		interactive: flags.boolean({ char: 'i' }),
		value: flags.string({ char: 'v' }),
	}

	private language!: string;

	async run(): Promise<void> {
		const { flags } = this.parse(Translate);
		const { key, value, interactive, lang } = flags;

		const requiredFlagsWerePassed = (key && value) || interactive;
		if (!requiredFlagsWerePassed) {
			this.explainCommandUsage();
			return;
		}

		this.language = await this.parseLanguageFlagOrGetFromPreferences(lang);

		if (interactive) {
			await this.runInteractiveMode();
		} else {
			this.addTranslation(key as string, value as string);
		}
	}

	private explainCommandUsage() {
		this.log('You should either pass --key and --value flags or --interactive. E.g:\n');
		Translate.examples.map((example) => this.log(example));
	}

	private async addTranslation(key: string, value: string) {
		const translationFiles: ITranslationFiles = container.resolve('TranslationFiles');
		await translationFiles.addTranslation(key, value, this.language);

		this.log(`✔️ '${ key }':'${ value }' was added to the ${ this.language } translation file.`)
	}

	private async runInteractiveMode() {
		const EXISTING_KEYS = 0;
		const BRAND_NEW_KEYS = 1;

		const response = await inquirer.prompt([{
			name: 'mode',
			message: 'what do you want to do?',
			type: 'list',
			choices: [{ name: 'add translations to existing untranslated keys', value: EXISTING_KEYS }, { name: 'add brand new translation keys', value: BRAND_NEW_KEYS }],
		}]);

		if (response.mode === EXISTING_KEYS) {
			await this.addTranslationsToExistingKeys();
		} else {
			await this.addNewTranslationKeys();
		}
	}

	private async addNewTranslationKeys() {
		const translationFiles: ITranslationFiles = container.resolve('TranslationFiles');

		this.log(`\nAdding new translations to the ${ this.language } translation file.`);
		this.log('Enter Q at any moment to finish entering keys.\n');

		let translationsAdded = 0;

		// eslint-disable-next-line no-constant-condition
		while (true) {
			const { key } = await inquirer.prompt([
				{
					name: 'key',
					message: 'key',
					type: 'input',
				},
			])

			if (key.trim().toUpperCase() === 'Q') {
				break;
			}

			const { value } = await inquirer.prompt([
				{
					name: 'value',
					message: 'value',
					type: 'input',
				},
			]);

			if (value.trim().toUpperCase() === 'Q') {
				break;
			}

			await translationFiles.addTranslation(key, value, this.language);

			translationsAdded++;

			this.log('\nAdded successfully! Enter the next one or Q to quit.');
		}

		if (translationsAdded === 0) {
			this.log('\nNo translations were added.');
		} else if (translationsAdded === 1) {
			this.log('\nAdded one new translation.');
		} else {
			this.log(`\nAdded ${ translationsAdded } new translations.`);
		}
	}

	private async addTranslationsToExistingKeys() {
		const codebase = container.resolve(Codebase);
		const untranslatedKeys = await codebase.getUntranslatedKeys(this.language);

		if (untranslatedKeys.length === 0) {
			this.log(`Did not found any untranslated keys in ${ this.language }`);
			return;
		}

		this.log(`Found ${ untranslatedKeys.length } untranslated key(s).`);
		this.log('Leave the translation empty to skip a key. Enter Q to quit.');

		let newTranslations = 0;

		for (const { key } of untranslatedKeys) {
			const response = await inquirer.prompt([{
				name: 'translation',
				message: key,
				type: 'input',
			}])

			const translation = (response.translation as string).trim();

			const translationSkipped = translation === '';
			if (translationSkipped) {
				continue;
			}

			const quitButtonPressed = translation.toUpperCase() === 'Q';
			if (quitButtonPressed) {
				break;
			}

			const translationFiles: ITranslationFiles = container.resolve('TranslationFiles');

			await translationFiles.addTranslation(key, translation, this.language);

			newTranslations++;
		}

		if (newTranslations === 0) {
			this.log('No translations were added.');
		} else if (newTranslations === 1) {
			this.log('One new translation was added.');
		} else {
			this.log(`${ newTranslations } new translations were added.`);
		}
	}
}
