import { errorBuilder, errorHandler } from 'errors/errors';
import { getIdentityById } from '../../db/oracledb/identities-dao';
import { serializeIdentity } from '../../serializers/identities-serializer';

/**
 * Get pet by unique ID
 *
 * @type {RequestHandler}
 */
const get = async (req, res) => {
  try {
    const { osuId } = req.params;
    const rawIdentity = await getIdentityById(osuId);
    if (!rawIdentity) {
      errorBuilder(res, 404, 'A person with the specified OSU ID was not found.');
    } else {
      const result = serializeIdentity(rawIdentity, req);
      res.send(result);
    }
  } catch (err) {
    errorHandler(res, err);
  }
};

export { get };
