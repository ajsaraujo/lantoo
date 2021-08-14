import { flags } from '@oclif/command'
import { cli } from 'cli-ux'
import { container } from 'tsyringe'

import { TranslationProgress } from '../modules/i18n/models/translation-progress'
import { Codebase } from '../modules/i18n/codebase/codebase'
import Command from './base'

export default class Report extends Command {
	static description = 'get a report on translation progress'

	static flags = {
		ascending: flags.boolean({ char: 'a' }),
		descending: flags.boolean({ char: 'd' }),
	}

	async run(): Promise<void> {
		const { flags } = this.parse(Report)
		const { ascending, descending } = flags

		const codebase = container.resolve(Codebase)
		let progressReports = await codebase.getTranslationProgress()

		if (ascending) {
			progressReports = this.sortAscending(progressReports)
		} else if (descending) {
			progressReports = this.sortDescending(progressReports)
		}

		let index = 0

		cli.table(progressReports, {
			index: { header: '#', get: () => this.alignRight(index++, '99'.length) },
			language: { header: 'Lang' },
			translationKeys: { header: 'Keys translated', get: (row) => this.alignRight(row.translatedStrings, TranslationProgress.stringsKnown) },
			'%': { get: (row) => this.formatPercentage(row.percentageOfStringsTranslated) },
		})
	}

	private sortAscending(progressReports: TranslationProgress[]) {
		return progressReports.sort((a, b) => a.translatedStrings - b.translatedStrings)
	}

	private sortDescending(progressReports: TranslationProgress[]) {
		return progressReports.sort((a, b) => b.translatedStrings - a.translatedStrings)
	}

	private alignRight(value: string | number, maxLen: number | string) {
		const str = String(value)
		const padding = typeof maxLen === 'number' ? maxLen : maxLen.length

		return str.padStart(padding, ' ')
	}

	private formatPercentage(percentage: number) {
		const twoDigits = (percentage * 100).toFixed(2)
		return this.alignRight(twoDigits, '100.00')
	}
}
