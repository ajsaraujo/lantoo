import { Hook } from '@oclif/config'

// Tsyringe asks us to import reflect-metadata.
const hook: Hook<'init'> = async () => {
  console.log('oii')
  require('reflect-metadata')
}

export default hook
