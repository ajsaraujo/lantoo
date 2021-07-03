import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import 'reflect-metadata'

process.env.NODE_ENV = 'test'

chai.use(chaiAsPromised)
