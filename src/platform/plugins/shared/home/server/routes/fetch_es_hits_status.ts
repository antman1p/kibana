/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { schema } from '@kbn/config-schema';
import { IRouter } from '@kbn/core/server';

export const registerHitsStatusRoute = (router: IRouter) => {
  router.post(
    {
      path: '/api/home/hits_status',
      security: {
        authz: {
          enabled: false,
          reason: 'This route is opted out from authorization',
        },
      },
      validate: {
        body: schema.object({
          index: schema.string(),
          query: schema.recordOf(schema.string(), schema.any()),
        }),
      },
    },
    router.handleLegacyErrors(async (context, req, res) => {
      const { index, query } = req.body;
      const client = (await context.core).elasticsearch.client;

      try {
        const body = await client.asCurrentUser.search({
          index,
          size: 1,
          query,
        });
        const count = body.hits.hits.length;

        return res.ok({
          body: {
            count,
          },
        });
      } catch (e) {
        return res.badRequest({
          body: e,
        });
      }
    })
  );
};
