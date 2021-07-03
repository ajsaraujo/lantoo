import { inject, injectable } from 'tsyringe'
import { FuzzyFinder } from './fuzzy-finder'
import validLanguages from './valid-languages'

@injectable()
export class LanguageUtils {
  constructor(@inject('FuzzyFinder') private fuzzy: FuzzyFinder) {}

  isLanguageCode(str: string) {
    return validLanguages.includes(this.fixCasing(str))
  }

  findSimilarLanguageCode(language: string) {
    return this.fuzzy.search(validLanguages, language)
  }

  fixCasing(languageCode: string) {
    if (languageCode.includes('-')) {
      const [firstPart, secondPart] = languageCode.split('-')
      return `${firstPart.toLowerCase()}-${secondPart.toUpperCase()}`
    }

    return languageCode.toLowerCase()
  }
}
