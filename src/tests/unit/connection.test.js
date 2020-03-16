import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import config from 'config';
import _ from 'lodash';
import proxyquireModule from 'proxyquire';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Prevent call thru to original dependencies
const proxyquire = proxyquireModule.noCallThru();

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('Test oracledb connection module', () => {
  let configGetStub;
  let connection;

  beforeEach(() => {
    configGetStub = sinon.stub(config, 'get')
      .withArgs('dataSources.oracledb')
      .returns({});
  });
  afterEach(() => sinon.restore());

  const createOracleDbStub = (createPoolStub) => {
    connection = proxyquire('db/oracledb/connection', {
      config: { get: configGetStub },
      oracledb: { createPool: createPoolStub },
      // suppress logger output for testing
      '../../utils/logger': { logger: { error: () => {} } },
    });
  };

  describe('getConnection', () => {
    it('Should call createPool if pool is falsy. Should not call createPool additional times', async () => {
      const createPoolStub = sinon.stub()
        .resolves({ getConnection: async () => 'test-connection' });
      createOracleDbStub(createPoolStub);

      /*
       * These cases are not in a loop since a for-loop would be required. Lodash functions wouldn't
       * work due to the need to run each async function in sequence.
       */
      const firstResult = connection.getConnection();
      await firstResult.should.eventually.be.fulfilled.and.deep.equal('test-connection');
      const secondResult = connection.getConnection();
      await secondResult.should.eventually.be.fulfilled.and.deep.equal('test-connection');
      createPoolStub.should.have.been.calledOnce.and.always.calledWithMatch({});
      createPoolStub.should.have.been.calledWithMatch({});
    });
  });

  const testCases = [
    {
      description: 'Should resolve when connection.execute resolves',
      getExecuteStub: () => sinon.stub().resolves(),
      testResult: (result) => result.should.eventually.be.fulfilled,
    },
    {
      description: 'Should reject when connection.execute rejects',
      getExecuteStub: () => sinon.stub().rejects(),
      testResult: (result) => result.should.be.rejected,
    },
  ];

  describe('validateOracleDb', () => {
    _.forEach(testCases, ({ description, getExecuteStub, testResult }) => {
      it(description, async () => {
        const executeStub = getExecuteStub();
        const closeStub = sinon.stub().resolves();
        const createPoolStub = sinon.stub()
          .resolves({ getConnection: async () => ({ execute: executeStub, close: closeStub }) });
        createOracleDbStub(createPoolStub);
        const result = connection.validateOracleDb();
        await testResult(result);
        createPoolStub.should.have.been.calledOnce;
        executeStub.should.have.been.calledOnce;
        closeStub.should.have.been.calledOnce;
      });
    });
  });
});
