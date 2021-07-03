import 'reflect-metadata';

import Command from '@oclif/command';
import { container } from 'tsyringe';

import { IPreferencesStorage } from '@modules/preferences';

export default abstract class extends Command {
	async init(): Promise<void> {
		await super.init();

		this.setConfigFilePath();
	}

	private setConfigFilePath() {
		const storage = container.resolve<IPreferencesStorage>('PreferencesStorage');
		storage.configDirectory = this.config.configDir;
	}
}
