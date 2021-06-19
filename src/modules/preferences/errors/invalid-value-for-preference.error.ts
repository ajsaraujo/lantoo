import { Preference } from '../models'

export class InvalidValueForPreferenceError extends Error {
  constructor(public preference: Preference) {
    super(`Tried to set an invalid value for preference ${preference}`)
  }
}
