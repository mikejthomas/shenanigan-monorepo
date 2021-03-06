import {
	GraphQLObjectType,
	GraphQLFloat,
	GraphQLNonNull,
	GraphQLID,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { UserLoader, ChallengeLoader, CommentLoader, PredictionLoader } from '../../loaders';

import ChallengeType from '../challenge/ChallengeType';
import UserType from '../user/UserType';

import { GraphQLContext } from '../../TypeDefinition';
import { connectionDefinitions, connectionArgs } from '../../utils';
import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import CommentType from '../comment/CommentType';

import { IPrediction } from './PredictionModel';
import { load } from './PredictionLoader';

const PredictionType = new GraphQLObjectType<IPrediction, GraphQLContext>({
	name: 'Prediction',
	description: 'Prediction data',
	fields: () => ({
		id: globalIdField('Prediction'),
		_id: {
			type: GraphQLNonNull(GraphQLID),
			resolve: (prediction) => prediction._id,
		},
		cards: {
			type: GraphQLNonNull(GraphQLList(GraphQLString)),
			resolve: (prediction) => prediction.cards,
		},
		option: {
			type: GraphQLNonNull(GraphQLInt),
			resolve: (prediction) => prediction.option,
		},
		opponent: {
			type: PredictionType,
			resolve: (prediction, _, context) => {
				return PredictionLoader.load(context, prediction.opponent);
			},
		},
		challenge: {
			type: ChallengeType,
			resolve: (prediction, _, context) => {
				return ChallengeLoader.load(context, prediction.challenge);
			},
		},
		creator: {
			type: UserType,
			resolve: (prediction, _, context) => {
				return UserLoader.load(context, prediction.creator);
			},
		},
		comment: {
			type: CommentType,
			resolve: (prediction, _, context) => {
				return CommentLoader.load(context, prediction.comment);
			},
		},
		blockTimestamp: {
			type: GraphQLNonNull(GraphQLInt),
			resolve: (prediction) => prediction.blockTimestamp,
		},
	}),
	interfaces: () => [nodeInterface],
});

export const PredictionConnection = connectionDefinitions({
	name: 'Prediction',
	nodeType: PredictionType,
});

registerTypeLoader(PredictionType, load);

export default PredictionType;
