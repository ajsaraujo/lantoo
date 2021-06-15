import { container } from 'tsyringe'
import { IPreferencesStorage, PreferencesStorage } from '../modules/preferences'

container.register<IPreferencesStorage>(
  'PreferencesStorage',
  PreferencesStorage
)
