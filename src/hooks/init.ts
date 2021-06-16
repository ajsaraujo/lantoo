import { container } from 'tsyringe'
import { IPreferencesStorage, PreferencesStorage } from '../modules/preferences'

function registerSingletons() {
  container.register<IPreferencesStorage>(
    'PreferencesStorage',
    PreferencesStorage
  )
}

export default registerSingletons
