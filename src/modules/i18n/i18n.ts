import validLanguages from './valid-languages'

export class I18n {
  isLanguageCode(str: string) {
    return validLanguages.includes(str)
  }
}
