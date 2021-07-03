import { fancy, expect } from 'fancy-test';

import { FuzzyFinder } from './fuzzy-finder';
import { I18n } from './i18n';

let i18n: I18n;

const test = fancy.do(() => {
	i18n = new I18n(new FuzzyFinder());
});

function converts(input: string) {
	return {
		to: (output: string) =>
			test.it(`should convert ${ input } to ${ output }`, () =>
				expect(i18n.fixCasing(input)).to.equal(output),
			),
	};
}

describe('i18n', () => {
	describe('fixCasing()', () => {
		converts('eN').to('en');
		converts('pt-br').to('pt-BR');
	});
});
