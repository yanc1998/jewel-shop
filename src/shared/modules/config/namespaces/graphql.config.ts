import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

export const graphqlConfig = registerAs('graphql', () => ({
  schema: process.env.GRAPHQL_SCHEMA,
  maxFiles: process.env.GRAPHQL_MAX_FILES,
  maxFilesSize: process.env.GRAPHQL_MAX_FILES_SIZE,
  depthLimit: process.env.GRAPHQL_DEPTH_LIMIT,
}));

export const graphqlSchema = {
  GRAPHQL_SCHEMA: Joi.string().required(),
  GRAPHQL_MAX_FILES: Joi.number().default(0),
  GRAPHQL_MAX_FILES_SIZE: Joi.number().default(0),
  GRAPHQL_DEPTH_LIMIT: Joi.number()
    .min(1)
    .default(5),
};
