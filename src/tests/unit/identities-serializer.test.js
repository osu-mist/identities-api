import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import _ from 'lodash';
import proxyquire from 'proxyquire';

import testData from 'tests/unit/test-data';
import { openapi } from 'utils/load-openapi';

chai.should();
chai.use(chaiAsPromised);
const { expect } = chai;

let identitiesSerializer;

describe('Test identities-serializer', () => {
  identitiesSerializer = proxyquire('../../serializers/identities-serializer', {});

  /**
   * Helper function to get schema from openapi specification
   *
   * @param {string} schema the name of schema
   * @param {object} nestedOption nested option
   * @param {boolean} nestedOption.dataItem a boolean which represents whether it's a data item
   * @param {string} nestedOption.dataField data field name
   * @returns {object} the result of definition
   */
  const getComponentSchemaProps = (schema, nestedOption) => {
    let result = openapi.components.schemas[schema].properties;

    if (nestedOption) {
      const { dataItem, dataField } = nestedOption;
      if (dataItem) {
        result = result.data.items.properties.attributes.properties;
      } else if (dataField) {
        result = result.data.properties.attributes.properties[dataField].items.properties;
      }
    }
    return result;
  };

  /**
   * Helper function to check the schema of identity resource
   *
   * @param {object} resource resource to check
   */
  const checkIdentitySchema = (resource) => {
    const {
      type,
      links,
      id,
      attributes,
    } = resource;
    const identityProps = getComponentSchemaProps('IdentityGetResource');
    expect(resource).to.contain.keys(_.keys(identityProps));
    expect(type).to.equal(openapi.components.schemas.IdentityType.enum[0]);
    expect(links).to.contain.keys(_.keys(getComponentSchemaProps('SelfLink')));
    expect(id).to.match(new RegExp(identityProps.id.pattern));
    expect(attributes).to.contain.keys(_.keys(identityProps.attributes.properties));
  };

  it('test serializeIdentities', () => {
    const { fakeIdentitiesTestCases } = testData;

    _.forEach(fakeIdentitiesTestCases, (fakeIdentityTestCase) => {
      const serializedIdentities = identitiesSerializer.serializeIdentities(fakeIdentityTestCase);
      expect(serializedIdentities).to.have.keys(getComponentSchemaProps('IdentitySetResult'));

      const { links, data } = serializedIdentities;
      expect(links).to.contain.keys(_.keys(getComponentSchemaProps('SelfLink')));
      expect(data).to.be.an('object');

      checkIdentitySchema(data);
    });
  });
  it('test serializeIdentity', () => {
    const { fakeIdentitiesTestCases } = testData;

    _.forEach(fakeIdentitiesTestCases, (fakeIdentityTestCase) => {
      const serializedIdentity = identitiesSerializer.serializeIdentity(fakeIdentityTestCase);
      expect(serializedIdentity).to.have.keys(getComponentSchemaProps('IdentityResult'));

      const { links, data } = serializedIdentity;
      expect(links).to.contain.keys(_.keys(getComponentSchemaProps('SelfLink')));
      expect(data).to.be.an('object');

      checkIdentitySchema(data);
    });
  });
});
