import _ from 'lodash';

import { errorBuilder, errorHandler } from 'errors/errors';
import { getIdentities } from '../db/oracledb/identities-dao';

/**
 * Get Identities
 *
 * @type {RequestHandler}
 */
const get = async (req, res) => {
  try {
    const { query } = req;
    const lastName = query['filter[lastName]'];
    const firstName = query['filter[firstName]'];

    if (_.isEmpty(query)) {
      return errorBuilder(res, 400, ['At least one parameter need to be provided.']);
    }

    if ((!lastName && firstName) || (lastName && !firstName)) {
      return errorBuilder(res, 400, ['filter[firstName] and filter[lastName] must be used together.']);
    }

    const result = await getIdentities(query);
    return res.send(result);
  } catch (err) {
    return errorHandler(res, err);
  }
};

export { get };
