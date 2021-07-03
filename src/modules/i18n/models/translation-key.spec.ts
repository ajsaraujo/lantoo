import { expect } from 'fancy-test'
import { KeyOccurrence, Translation, TranslationKey } from './translation-key'

describe('TranslationKey', () => {
  describe('create()', () => {
    it('should return a failing result if no values are passed', () => {
      const result = TranslationKey.create()
      expect(result.isFailure).to.be.true
    })

    it('should return an unused key if an occurrence is not passed', () => {
      const translation = new Translation('spiderman', 'miranha')
      const result = TranslationKey.create(translation)
      const translationKey = result.value

      expect(translationKey.isUnused).to.equal(true)
    })

    it('should return an untranslated key if no translation is passed', () => {
      const occurrence = new KeyOccurrence('message', 'app/messages.js')
      const result = TranslationKey.create(undefined, occurrence)
      const translationKey = result.value

      expect(translationKey.isUntranslated).to.equal(true)
    })
  })
})
