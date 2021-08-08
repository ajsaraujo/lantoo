/**
 * An application that lantoo is running against.
 * E.g: Rocket.Chat desktop client, Rocket.Chat mobile client, etc.
  */
export interface App {
	getTranslationFilePath: (language: string) => string;
}

export class WebApp implements App {
	getTranslationFilePath(language: string): string {
		return `packages/rocketchat-i18n/i18n/${ language }.i18n.json`
	}
}

export class MobileApp implements App {
	getTranslationFilePath(language: string): string {
		return `app/i18n/locales/${ language }.json`;
	}
}

export class DesktopApp implements App {
	getTranslationFilePath(language: string): string {
		return `src/i18n/${ language }.i18n.json`;
	}
}
