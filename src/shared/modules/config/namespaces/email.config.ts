import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

export const emailConfig = registerAs('smtp', () => ({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  email: process.env.SMTP_EMAIL,
  password: process.env.SMTP_PASSWORD,
}));

export const emailSchema = {
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_EMAIL: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
};
