import { Serializer as JsonApiSerializer } from 'jsonapi-serializer';
import _ from 'lodash';

import { serializerOptions } from 'utils/jsonapi';
import { openapi } from 'utils/load-openapi';
import { paginate } from 'utils/paginator';
import { apiBaseUrl, resourcePathLink, paramsLink } from 'utils/uri-builder';

const identityGetResourceProp = openapi.components.schemas.IdentityGetResource.properties;
const identityGetResourceType = identityGetResourceProp.type.enum[0];
const identityGetResourceKeys = _.keys(identityGetResourceProp.attributes.properties);
const identityGetResourcePath = 'identities';
const identityGetResourceUrl = resourcePathLink(apiBaseUrl, identityGetResourcePath);

/**
 * Serialize identityResources to JSON API
 *
 * @param {object[]} rawIdentities Raw data rows from data source
 * @param {object} req Express request object
 * @returns {object} Serialized identityResources object
 */
const serializeIdentities = (rawIdentities, req) => {
  const { query } = req;

  // Add pagination links and meta information to options if pagination is enabled
  const pageQuery = {
    size: query['page[size]'],
    number: query['page[number]'],
  };

  const pagination = paginate(rawIdentities, pageQuery);
  pagination.totalResults = rawIdentities.length;
  rawIdentities = pagination.paginatedRows;

  // TODO use req.path
  const topLevelSelfLink = paramsLink(identityGetResourceUrl, query);
  const serializerArgs = {
    identifierField: 'osuId',
    resourceKeys: identityGetResourceKeys,
    pagination,
    resourcePath: identityGetResourcePath,
    topLevelSelfLink,
    query,
    enableDataLinks: true,
  };

  return new JsonApiSerializer(
    identityGetResourceType,
    serializerOptions(serializerArgs),
  ).serialize(rawIdentities);
};

/**
 * Serialize identityResource to JSON API
 *
 * @param {object} rawIdentity Raw data row from data source
 * @returns {object} Serialized identityResource object
 */
const serializeIdentity = (rawIdentity) => {
  const topLevelSelfLink = resourcePathLink(identityGetResourceUrl, rawIdentity.osuId);

  const serializerArgs = {
    identifierField: 'osuId',
    resourceKeys: identityGetResourceKeys,
    resourcePath: identityGetResourcePath,
    topLevelSelfLink,
    enableDataLinks: true,
  };

  return new JsonApiSerializer(
    identityGetResourceType,
    serializerOptions(serializerArgs),
  ).serialize(rawIdentity);
};
export { serializeIdentities, serializeIdentity };
