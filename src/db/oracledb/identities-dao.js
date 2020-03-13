import _ from 'lodash';

import { serializeIdentities, serializeIdentity } from 'serializers/identities-serializer';
import { parseQuery } from 'utils/parse-query';
import { getConnection } from './connection';
import { contrib } from './contrib/contrib';

/**
 * Return a list of identities
 *
 * @param {object} query query parameters
 * @returns {Promise<object[]>} Promise object represents a list of identities
 */
const getIdentities = async (query) => {
  const parsedQuery = parseQuery(query);

  const connection = await getConnection();
  try {
    const { rows } = await connection.execute(contrib.getIdentities(parsedQuery), parsedQuery);

    const serializedIdentities = serializeIdentities(rows, query);
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
    const query = { osuId };
    const { rows } = await connection.execute(contrib.getIdentities(query), query);
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
