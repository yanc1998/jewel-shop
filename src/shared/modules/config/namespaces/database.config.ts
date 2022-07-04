import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

export const databaseConfig = registerAs('database', () => ({
  type: process.env.DATABASE_TYPE,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  connectString: process.env.DATABASE_CONNECT_STRING,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNC === 'true',
  logger: process.env.DATABASE_LOGGER,
}));

export const databaseSchema = {
  DATABASE_TYPE: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_CONNECT_STRING: Joi.string(),
  DATABASE_HOST: Joi.string(),
  DATABASE_NAME: Joi.string(),
  DATABASE_SYNC: Joi.string()
    .valid('true', 'false')
    .default('false'),
};
