import { errorHandler } from 'errors/errors';
import { getIdentities } from '../db/oracledb/identities-dao';
import { serializeIdentities } from '../serializers/identities-serializer';

/**
 * Get pets
 *
 * @type {RequestHandler}
 */
const get = async (req, res) => {
  try {
    const rawPets = await getIdentities(req.query);
    const result = serializeIdentities(rawPets, req);
    return res.send(result);
  } catch (err) {
    return errorHandler(res, err);
  }
};


export { get };
