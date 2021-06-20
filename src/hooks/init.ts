import { container } from 'tsyringe'

import { IPreferencesStorage, PreferencesStorage } from '../modules/preferences'
import { FuzzyFinder, IFuzzyFinder } from '../modules/i18n/fuzzy-finder'

function registerSingletons() {
  container.register<IFuzzyFinder>('FuzzyFinder', FuzzyFinder)

  // Don't register the singletons below in test environment
  if (process.env.NODE_ENV === 'test') {
    return
  }

  container.registerSingleton<IPreferencesStorage>(
    'PreferencesStorage',
    PreferencesStorage
  )
}

export default registerSingletons
