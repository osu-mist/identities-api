import { errorHandler } from 'errors/errors';
import { getIdentities } from '../db/oracledb/identities-dao';

/**
 * Get pets
 *
 * @type {RequestHandler}
 */
const get = async (req, res) => {
  try {
    const result = await getIdentities(req.query);
    return res.send(result);
  } catch (err) {
    return errorHandler(res, err);
  }
};

export { get };
