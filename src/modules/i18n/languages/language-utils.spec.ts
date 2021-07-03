import { fancy, expect } from 'fancy-test'

import { FuzzyFinder } from './fuzzy-finder'
import { LanguageUtils } from './language-utils'

let languageUtils: LanguageUtils

const test = fancy.do(() => {
	languageUtils = new LanguageUtils(new FuzzyFinder())
})

function converts(input: string) {
	return {
		to: (output: string) =>
			test.it(`should convert ${ input } to ${ output }`, () =>
				expect(languageUtils.fixCasing(input)).to.equal(output),
			),
	}
}

describe('i18n', () => {
	describe('fixCasing()', () => {
		converts('eN').to('en')
		converts('pt-br').to('pt-BR')
	})
})
