import { container } from 'tsyringe'
import { IPreferencesStorage, PreferencesStorage } from '../modules/preferences'

function registerSingletons() {
  // Don't register singletons in test environment
  if (process.env.NODE_ENV === 'test') {
    return
  }

  container.registerSingleton<IPreferencesStorage>(
    'PreferencesStorage',
    PreferencesStorage
  )
}

export default registerSingletons
