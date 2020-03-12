import { errorBuilder, errorHandler } from 'errors/errors';
import { getIdentityById } from '../../db/oracledb/identities-dao';

/**
 * Get pet by unique ID
 *
 * @type {RequestHandler}
 */
const get = async (req, res) => {
  try {
    const { osuId } = req.params;
    const result = await getIdentityById(osuId);
    if (!result) {
      errorBuilder(res, 404, 'A person with the specified OSU ID was not found.');
    } else {
      res.send(result);
    }
  } catch (err) {
    errorHandler(res, err);
  }
};

export { get };
