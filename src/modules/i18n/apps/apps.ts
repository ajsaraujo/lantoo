/**
 * An application that lantoo is running against.
 * E.g: Rocket.Chat desktop client, Rocket.Chat mobile client, etc.
  */
export interface App {
	translationFileFolder: string;

	getTranslationFilePath: (language: string) => string;
}

export class WebApp implements App {
	readonly translationFileFolder = 'packages/rocketchat-i18n/i18n';

	getTranslationFilePath(language: string): string {
		return `${ this.translationFileFolder }/${ language }.i18n.json`
	}
}

export class MobileApp implements App {
	readonly translationFileFolder = 'app/i18n/locales';

	getTranslationFilePath(language: string): string {
		return `${ this.translationFileFolder }/${ language }.json`;
	}
}

export class DesktopApp implements App {
	readonly translationFileFolder = 'src/i18n';

	getTranslationFilePath(language: string): string {
		return `${ this.translationFileFolder }/${ language }.i18n.json`;
	}
}
