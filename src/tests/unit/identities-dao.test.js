import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import config from 'config';
import _ from 'lodash';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import { contrib } from 'db/oracledb/contrib/contrib';

chai.should();
chai.use(chaiAsPromised);

describe('Test identities-dao', () => {
  sinon.replace(config, 'get', () => ({ oracledb: {} }));
  const connStub = {
    execute: (sql) => {
      const sqlResults = {
        multiResults: { rows: [{}, {}] },
        singleResult: { rows: [{}] },
        emptyResult: { rows: [] },
      };
      return sql in sqlResults ? sqlResults[sql] : sqlResults.singleResult;
    },
    close: () => null,
  };
  const identitiesDao = proxyquire('db/oracledb/identities-dao', {
    './connection': {
      getConnection: sinon.stub().resolves(connStub),
    },
    '../../serializers/identities-serializer': {
      serializeIdentity: (rawIdentity) => rawIdentity,
      serializeIdentities: (rawIdentities) => rawIdentities,
    },
  });

  afterEach(() => sinon.restore());

  it('getIdentities should be fulfilled', () => {
    const expectResult = [{}, {}];

    sinon.stub(contrib, 'getIdentities').returns('multiResults');
    const fulfilledResult = identitiesDao.getIdentities({});

    return fulfilledResult.should
      .eventually.be.fulfilled
      .and.deep.equal(expectResult);
  });
  it('getIdentities should be rejected', () => {
    sinon.stub(contrib, 'getIdentities').throws(new Error('Throw fake error.'));
    const rejectedResult = identitiesDao.getIdentities();

    return rejectedResult.should
      .eventually.be.rejectedWith(Error);
  });
  it('getIdentityById should be fulfilled', () => {
    const getIdentitiesStub = sinon.stub(contrib, 'getIdentities');

    const expectedSerializedSingleIdentity = {};
    const fulfilledCases = [
      // this test case won't call identitiesSerializer
      { testCase: 'emptyResult', expected: undefined },
      // this test case will require a call of identitiesSerializer
      { testCase: 'singleResult', expected: expectedSerializedSingleIdentity },
    ];

    const fulfilledPromises = [];
    _.forEach(fulfilledCases, ({ testCase, expected }, index) => {
      getIdentitiesStub.onCall(index).returns(testCase);

      const result = identitiesDao.getIdentityById();
      fulfilledPromises.push(result.should
        .eventually.be.fulfilled
        .and.deep.equal(expected));
    });
    return Promise.all(fulfilledPromises);
  });
  it('getIdentityById should be rejected', () => {
    sinon.stub(contrib, 'getIdentities').returns('multiResults');

    const result = identitiesDao.getIdentityById();

    return result.should
      .eventually.be.rejectedWith(Error, 'Expect a single object but got multiple results.');
  });
});
