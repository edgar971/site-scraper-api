import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import config from 'config'
import connect, { Database, closeDatabase } from '../../postgres'
import * as wrappedPgp from '../../postgres/wrapped-pgp';

chai.use(sinonChai)
chai.should()

const sandbox = sinon.sandbox.create()
context('#connect specs', () => {
  describe('When connecting to the database and the connection is not open', () => {
    let fakedDatabase = <Database>{}
    let fakedConnection

    before(() => {
      fakedConnection = sandbox.stub().returns(fakedDatabase)
      fakedConnection.end = sandbox.stub()
      sandbox.stub(wrappedPgp, 'default').returns(fakedConnection)
      connect()
    })

    it('should connect to the database', () => fakedConnection.should.have.been.calledWith(config.database))
    it('should NOT call the end function', ()=> fakedConnection.end.should.not.have.been.called)

    after(() => {
      closeDatabase()
      sandbox.restore()
    })
  })
  
  describe('When connecting to the database and the connection is already open', () => {
    let fakedDatabase = <Database>{}
    let fakedConnection

    before(() => {
      fakedConnection = sandbox.stub().returns(fakedDatabase)
      fakedConnection.end = sandbox.stub()
      sandbox.stub(wrappedPgp, 'default').returns(fakedConnection)
      connect()
      connect()
    })

    it('should call the pgp function once', () => fakedConnection.should.have.been.calledOnce)
    it('should NOT call the end function', ()=> fakedConnection.end.should.not.have.been.called)
    it('should connect to the database', () => fakedConnection.should.have.been.calledWith(config.database))

    after(() => {
      closeDatabase()
      sandbox.restore()
    })
  })

  describe('When closing the database and the database connection is open', () => {
    let fakedDatabase = <Database>{}
    let fakedConnection

    before(() => {
      fakedConnection = sandbox.stub().returns(fakedDatabase)
      fakedConnection.end = sandbox.stub()
      sandbox.stub(wrappedPgp, 'default').returns(fakedConnection)
      connect()
      closeDatabase()
    })

    it('should call the end function', ()=> fakedConnection.end.should.have.been.called)

    after(() => {
      sandbox.restore()
    })
  })

  describe('When closing the database and the database is already closed', () => {
    let fakedDatabase = <Database>{}
    let fakedConnection

    before(() => {
      fakedConnection = sandbox.stub().returns(fakedDatabase)
      fakedConnection.end = sandbox.stub()
      sandbox.stub(wrappedPgp, 'default').returns(fakedConnection)
      closeDatabase()
    })

    it('should NOT call the end function', ()=> fakedConnection.end.should.not.have.been.called)

    after(() => {
      sandbox.restore()
    })
  })

  
  describe('When connecting to a named database and the connection is not open', () => {
    let fakedDatabase = <Database>{}
    let fakedConnection
    const database = 'database'
    const expectedConfig = {
      ...config.database,
      database
    }

    before(() => {
      fakedConnection = sandbox.stub().returns(fakedDatabase)
      fakedConnection.end = sandbox.stub()
      sandbox.stub(wrappedPgp, 'default').returns(fakedConnection)
      connect(database)
    })

    it('should not end the connection', () => fakedConnection.end.should.not.have.been.calledOnce)
    it('should connect to the database', () => fakedConnection.should.have.been.calledWith(expectedConfig))

    after(() => {
      closeDatabase()
      sandbox.restore()
    })
  })

  describe('When connecting to a named database and the connection is open', () => {
    let fakedDatabase = <Database>{}
    let fakedConnection
    const database = 'database'
    const expectedConfig = {
      ...config.database,
      database
    }

    before(() => {
      fakedConnection = sandbox.stub().returns(fakedDatabase)
      fakedConnection.end = sandbox.stub()
      sandbox.stub(wrappedPgp, 'default').returns(fakedConnection)
      connect(database)
      connect(database)
    })

    it('should open the connection twice', () => fakedConnection.should.have.been.calledTwice)    
    it('should end the connection', () => fakedConnection.end.should.have.been.calledOnce)
    it('should connect to the database', () => fakedConnection.should.have.been.calledWith(expectedConfig))

    after(() => {
      closeDatabase()      
      sandbox.restore()
    })
  })
})