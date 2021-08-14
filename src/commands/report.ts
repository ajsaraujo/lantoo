import { cli } from 'cli-ux'
import { container } from 'tsyringe'

import { Codebase } from '../modules/i18n/codebase/codebase'
import Command from './base'

export default class Report extends Command {
	static description = 'get a report on translation progress'

	async run(): Promise<void> {
		const codebase = container.resolve(Codebase)
		const progressReports = await codebase.getTranslationProgress()

		let index = 0

		this.log('')

		cli.table(progressReports, {
			index: { header: '#', get: () => `${ index++ }`.padStart(2, ' ') },
			language: { header: 'Lang' },
			translationKeys: { header: 'Keys translated', get: (row) => row.translatedStrings },
			'%': { get: (row) => this.formatPercentage(row.percentageOfStringsTranslated) },
		})
	}

	private formatPercentage(percentage: number) {
		const twoDigits = (percentage * 100).toFixed(1)
		const padded = twoDigits.padStart(4, ' ')

		return padded
	}
}
