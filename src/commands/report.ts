import { cli } from 'cli-ux'
import { container } from 'tsyringe'

import { Codebase } from '../modules/i18n/codebase/codebase'
import Command from './base'

export default class Report extends Command {
	static description = 'get a report on translation progress'

	async run(): Promise<void> {
		const codebase = container.resolve(Codebase)
		const progressReports = await codebase.getTranslationProgress()

		cli.table(progressReports, {
			language: {},
			translationKeys: { get: (row) => row.translatedStrings },
			'%': { get: (row) => (row.percentageOfStringsTranslated * 100).toFixed(2) },
		})
	}
}
