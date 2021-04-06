/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import Boom from '@hapi/boom';
import { schema } from '@kbn/config-schema';
import { buildCommentUserActionItem } from '../../../../services/user_actions/helpers';
import { RouteDeps } from '../../types';
import { wrapError } from '../../utils';
import {
  CASE_COMMENTS_URL,
  ENABLE_CASE_CONNECTOR,
  SAVED_OBJECT_TYPES,
} from '../../../../../common/constants';
import { AssociationType } from '../../../../../common/api';

export function initDeleteAllCommentsApi({
  attachmentService,
  caseService,
  router,
  userActionService,
  logger,
}: RouteDeps) {
  router.delete(
    {
      path: CASE_COMMENTS_URL,
      validate: {
        params: schema.object({
          case_id: schema.string(),
        }),
        query: schema.maybe(
          schema.object({
            subCaseId: schema.maybe(schema.string()),
          })
        ),
      },
    },
    async (context, request, response) => {
      try {
        if (!ENABLE_CASE_CONNECTOR && request.query?.subCaseId !== undefined) {
          throw Boom.badRequest(
            'The `subCaseId` is not supported when the case connector feature is disabled'
          );
        }

        const soClient = context.core.savedObjects.getClient({
          includedHiddenTypes: SAVED_OBJECT_TYPES,
        });
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { username, full_name, email } = await caseService.getUser({ request });
        const deleteDate = new Date().toISOString();

        const subCaseId = request.query?.subCaseId;
        const id = subCaseId ?? request.params.case_id;
        const comments = await caseService.getCommentsByAssociation({
          soClient,
          id,
          associationType: subCaseId ? AssociationType.subCase : AssociationType.case,
        });

        await Promise.all(
          comments.saved_objects.map((comment) =>
            attachmentService.delete({
              soClient,
              attachmentId: comment.id,
            })
          )
        );

        await userActionService.bulkCreate({
          soClient,
          actions: comments.saved_objects.map((comment) =>
            buildCommentUserActionItem({
              action: 'delete',
              actionAt: deleteDate,
              actionBy: { username, full_name, email },
              caseId: request.params.case_id,
              subCaseId,
              commentId: comment.id,
              fields: ['comment'],
            })
          ),
        });

        return response.noContent();
      } catch (error) {
        logger.error(
          `Failed to delete all comments in route case id: ${request.params.case_id} sub case id: ${request.query?.subCaseId}: ${error}`
        );
        return response.customError(wrapError(error));
      }
    }
  );
}
