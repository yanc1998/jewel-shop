import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

export const inventoryClientConfig = registerAs('inventoryClient', () => ({
  url: process.env.INVENTORY_CLIENT_URL,
  port: process.env.INVENTORY_CLIENT_PORT,
  rabbitmqUrl: process.env.RABBITMQ_URL,
  queueName: process.env.QUEUE_NAME,
}));

export const inventoryClientSchema = {
  INVENTORY_CLIENT_URL: Joi.string().required(),
  INVENTORY_CLIENT_PORT: Joi.string().required(),
  RABBITMQ_URL: Joi.string().required(),
  QUEUE_NAME: Joi.string().default('inventory_queue'),
};
