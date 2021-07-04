import { expect, test } from '@oclif/test'
import { container } from 'tsyringe'
import sinon from 'sinon'

import { CodeParser, MockCodeParser } from '@modules/i18n/codebase/code-parser'
import { KeyOccurrence } from '@modules/i18n/models/translation-key'
import { IFileSystem, MockFileSystem } from '@modules/shared'
import {
	IPreferencesStorage,
	MockPreferenceStorage,
} from '@modules/preferences'
import {
	ITranslationFiles,
	TranslationFiles,
} from '@modules/i18n/codebase/translation-files'

let fileSystem: MockFileSystem
let codeParser: MockCodeParser

const prepare = test.do(() => {
	container.reset()

	container.registerSingleton<CodeParser>(CodeParser, MockCodeParser)
	container.registerSingleton<IFileSystem>('FileSystem', MockFileSystem)
	container.registerSingleton<IPreferencesStorage>(
		'PreferencesStorage',
		MockPreferenceStorage,
	)
	container.registerSingleton<ITranslationFiles>(
		'TranslationFiles',
		TranslationFiles,
	)

	fileSystem = container.resolve('FileSystem')
	codeParser = container.resolve(CodeParser)
})

function setup(
	translations: Record<string, string> = {},
	occurrences: KeyOccurrence[] = [],
) {
	return prepare
		.do(() => {
			sinon.stub(fileSystem, 'readJSON').resolves(translations)
			sinon.stub(codeParser, 'getKeyOccurrences').resolves(occurrences)
		})
		.stdout()
}

describe('find command', () => {
	describe("when 'key' argument is passed", () => {
		describe('when key is found in code and translation files', () => {
			const whenKeyIsFoundInCodeAndTranslationFiles = setup(
				{ Page_title: 'Título da Página' },
				[
					new KeyOccurrence(
						'Page_title',
						'app/message-pin/client/pinMessage.js',
					),
				],
			).command(['find', 'Page_title', '--lang', 'pt-BR'])

			whenKeyIsFoundInCodeAndTranslationFiles.it(
				'should say the key is ok',
				(ctx) => {
					expect(ctx.stdout).to.contain('Page_title is OK')
				},
			)

			whenKeyIsFoundInCodeAndTranslationFiles.it(
				'should say where the key was found',
				(ctx) => {
					expect(ctx.stdout).to.contain(
						'It is referenced in the codebase (found in app/message-pin/client/pinMessage.js)',
					)
				},
			)

			whenKeyIsFoundInCodeAndTranslationFiles.it(
				'should say what is the key translation',
				(ctx) => {
					expect(ctx.stdout).to.contain(
						"It has a translation in pt-BR: 'Título da Página'",
					)
				},
			)
		})

		describe('when key is found in code but not in translation files', () => {
			const whenKeyIsFoundInCodeButNotInTranslationFiles = setup({}, [
				new KeyOccurrence(
					'away_female',
					'app/message-pin/client/pinMessage.js',
				),
			]).command(['find', 'away_female', '--lang', 'pt-BR'])

			whenKeyIsFoundInCodeButNotInTranslationFiles.it(
				'should say the key is untranslated',
				(ctx) => {
					expect(ctx.stdout).to.contain('away_female is UNTRANSLATED')
				},
			)
		})

		describe('when key is found in translation files but not in code', () => {
			const whenKeyIsFoundInTranslationFilesButNotInCode = setup({
				to_infinity_and_beyond: 'Ao infinito, e além!',
			}).command(['find', 'to_infinity_and_beyond', '--lang', 'pt-BR'])

			whenKeyIsFoundInTranslationFilesButNotInCode.it(
				'should say the key is unused',
				(ctx) => {
					expect(ctx.stdout).to.contain('to_infinity_and_beyond is UNUSED')
					expect(ctx.stdout).to.contain(
						'It has a translation in pt-BR, but it is not used in the codebase.',
					)
				},
			)
		})

		describe('when key is not found anywhere', () => {
			const whenKeyIsNotFoundAnywhere = setup({}, []).command([
				'find',
				'away_male',
				'--lang',
				'pt-BR',
			])

			whenKeyIsNotFoundAnywhere.it(
				'should say the key was not found',
				(ctx) => {
					expect(ctx.stdout).to.contain('away_male was not found')
				},
			)
		})
	})

	describe("when 'key' argument is not passed", () => {
		const translations = { away_male: 'Ausente', hello: 'Olá' }
		const occurrences = [
			new KeyOccurrence('away_male', 'src/away_handler.js'),
			new KeyOccurrence('to_infinity_and_beyond', 'src/motivational.js'),
		]

		const mockData = setup(translations, occurrences)

		const findUntranslatedKeys = mockData.command([
			'find',
			'--untranslated',
			'--lang',
			'pt-BR',
		])

		findUntranslatedKeys.it('should find untranslated keys', (ctx) => {
			expect(ctx.stdout).to.contain('Found 1 key lacking translation in pt-BR')
			expect(ctx.stdout).to.contain('to_infinity_and_beyond')
		})

		const findUnusedKeys = mockData.command([
			'find',
			'--unused',
			'--lang',
			'pt-BR',
		])

		findUnusedKeys.it('should find unused keys', (ctx) => {
			expect(ctx.stdout).to.contain('Found 1 unused key in pt-BR')
			expect(ctx.stdout).to.contain('hello')
		})
	})
})
