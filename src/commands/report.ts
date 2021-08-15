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
			index: this.rightAlignedColumn({ header: '#', get: () => index++, maxValueLen: '99'.length }),
			language: { header: 'Lang' },
			translationKeys: this.rightAlignedColumn({ header: 'Keys translated', get: (row) => row.translatedStrings, maxValueLen: String(TranslationProgress.stringsKnown).length }),
			'%': this.rightAlignedColumn({ header: '%', get: (row) => this.formatPercentage(row.percentageOfStringsTranslated), maxValueLen: '100.00'.length }),
		})
	}

	private sortAscending(progressReports: TranslationProgress[]) {
		return progressReports.sort((a, b) => a.translatedStrings - b.translatedStrings)
	}

	private sortDescending(progressReports: TranslationProgress[]) {
		return progressReports.sort((a, b) => b.translatedStrings - a.translatedStrings)
	}

	private rightAlignedColumn(options: { header: string, get: (tp: TranslationProgress) => string | number, maxValueLen: number }) {
		const { header, get, maxValueLen } = options
		const padding = Math.max(header.length, maxValueLen)

		return {
			header: header.padStart(padding, ' '),
			get: (row: TranslationProgress) => String(get(row)).padStart(padding, ' '),
		}
	}

	private formatPercentage(percentage: number) {
		return (percentage * 100).toFixed(2)
	}
}
