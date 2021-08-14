import test from 'fancy-test'
import sinon, { SinonStubbedInstance } from 'sinon'
import { expect } from 'chai'
import { container } from 'tsyringe'

import { FileSystem } from '@modules/io'

import { TranslationFiles } from './translation-files'
import { WebApp } from '../apps/apps'

describe('TranslationFiles', () => {
	let fs: SinonStubbedInstance<FileSystem>
	let translationFiles: TranslationFiles

	const setup = test.do(() => {
		container.registerInstance('App', new WebApp())

		fs = sinon.createStubInstance(FileSystem)
		fs.readJSON.resolves({})
		translationFiles = new TranslationFiles(fs)
	})

	const { it } = setup

	describe('addTranslation()', () => {
		it('should add a translation to the file', async () => {
			await translationFiles.addTranslation('to_infinity_and_beyond', 'Ao infinito, e além!', 'pt-BR')
			const translationsWritten = fs.writeJSON.firstCall.args[1] as Record<string, string>
			expect(translationsWritten.to_infinity_and_beyond).to.equal('Ao infinito, e além!')
		})
	})

	describe('getTranslation()', () => {
		it('should return the translation read from the file system', async () => {
			fs.readJSON.resolves({ apple: 'maçã' })
			const translation = await translationFiles.getTranslation('apple', 'pt-BR')

			expect(translation?.key).to.equal('apple')
			expect(translation?.value).to.equal('maçã')
		})

		it('should correctly return nested translations', async () => {
			fs.readJSON.resolves({ fruits: { apple: 'maçã' } })
			const translation = await translationFiles.getTranslation('fruits.apple', 'pt-BR')

			expect(translation?.key).to.equal('fruits.apple')
			expect(translation?.value).to.equal('maçã')
		})
	})

	describe('getAllTranslationsFromAllLanguages()', () => {
		it('should return a map with all translations from all languages', async () => {
			fs.readJSON.callsFake(async (path: string) => {
				if (path.includes('en')) {
					return {
						away_male: 'Away',
						__count__people_in_the_room: '_count_ people in the room',
						settings: 'Configurações',
					}
				}

				return {
					away_male: 'Ausente',
					__count_people_in_the_room: '_count_ pessoas na sala',
				}
			})

			fs.getFileNames.resolves(['en.i18n.json', 'pt-BR.i18n.json'])

			const translations = await translationFiles.getAllTranslationsFromAllLanguages()

			expect(Object.keys(translations).length).to.equal(2)
			expect(translations.en.length).to.equal(3)
			expect(translations['pt-BR'].length).to.equal(2)
		})

		it('should work fine even if a language returns undefined', async () => {
			fs.readJSON.callsFake(async (path: string) => {
				if (path.includes('en')) {
					return {
						away_male: 'Away',
						__count__people_in_the_room: '_count_ people in the room',
						settings: 'Configurações',
					}
				}

				return undefined
			})

			fs.getFileNames.resolves(['en.i18n.json', 'pt-BR.i18n.json'])

			const translations = await translationFiles.getAllTranslationsFromAllLanguages()

			expect(Object.keys(translations).length).to.equal(1)
			expect(translations.en.length).to.equal(3)
		})
	})
})
