import { GraphQLID, GraphQLInputObjectType } from 'graphql';

import { FILTER_CONDITION_TYPE } from '@entria/graphql-mongo-helpers';

import { getObjectId } from '../../utils';

export const commentFilterMapping = {
  creator: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: (val: string) => val && getObjectId(val),
  },
  challenge: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    format: (val: string) => val && getObjectId(val),
  },
};

const CommentFilterInputType = new GraphQLInputObjectType({
  name: 'CommentFilter',
  description: 'Used to filter comments',
  fields: () => ({
    creator: {
      type: GraphQLID,
    },
    challenge: {
      type: GraphQLID,
    },
    comment: {
      type: GraphQLID,
    },
  }),
});

export default CommentFilterInputType;