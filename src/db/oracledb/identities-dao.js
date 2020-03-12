import config from 'config';
import _ from 'lodash';

import { serializeIdentities, serializeIdentity } from 'serializers/identities-serializer';
import { getConnection } from './connection';
import { contrib } from './contrib/contrib';

const { endpointUri } = config.get('server');

/**
 * Return a list of identities
 *
 * @returns {Promise<object[]>} Promise object represents a list of identities
 */
const getIdentities = async () => {
  const connection = await getConnection();
  try {
    const { rows } = await connection.execute(contrib.getIdentities());
    const serializedIdentities = serializeIdentities(rows, endpointUri);
    return serializedIdentities;
  } finally {
    connection.close();
  }
};

/**
 * Return a specific identity by OSU ID
 *
 * @param {string} osuId 9-digit OSU ID
 * @returns {Promise<object>} Promise object represents a specific identity
 */
const getIdentityById = async (osuId) => {
  const connection = await getConnection();
  try {
    const { rows } = await connection.execute(contrib.getIdentityById(), [osuId]);
    if (_.isEmpty(rows)) {
      return undefined;
    }
    if (rows.length > 1) {
      throw new Error('Expect a single object but got multiple results.');
    } else {
      const [rawIdentity] = rows;

      const serializedIdentity = serializeIdentity(rawIdentity);
      return serializedIdentity;
    }
  } finally {
    connection.close();
  }
};

export { getIdentities, getIdentityById };
