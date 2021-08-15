import sinon, { SinonStubbedInstance } from 'sinon'
import { expect, fancy } from 'fancy-test'

import { FileSystem } from '@modules/io'

import { PreferencesStorage } from './preferences-storage'

let storage: PreferencesStorage
let fileSystem: SinonStubbedInstance<FileSystem>

function setup() {
	fileSystem = sinon.createStubInstance(FileSystem);

	storage = new PreferencesStorage(fileSystem)
	storage.configDirectory = 'mock/path'
}

const test = fancy.do(setup)

describe('PreferencesStorage', () => {
	test.it('should read JSON from file system', async () => {
		fileSystem.readJSON.resolves({ lang: 'pt-BR' })

		const value = await storage.get('lang')

		expect(value).to.equal('pt-BR')
	})

	test.it('should call write JSON on set', async () => {
		fileSystem.readJSON.resolves({})

		await storage.set('lang', 'en-US')

		expect(fileSystem.writeJSON.firstCall.lastArg).to.eql({ lang: 'en-US' })
	})

	test.it(
		'should create an empty JSON file if one does not exist yet',
		async () => {
			fileSystem.readJSON.throws({ code: 'ENOENT' })

			await storage.get('lang')

			expect(fileSystem.writeJSON.firstCall.lastArg).to.eql({})
		},
	)
})
