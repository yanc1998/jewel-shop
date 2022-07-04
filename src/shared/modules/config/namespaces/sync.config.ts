import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

export const syncConfig = registerAs('sync', () => ({
  syncronize: process.env.SYNCRONIZE === 'true',
  syncLocatorInterval: process.env.SYNC_LOCATOR_INTERVAL,
  syncSubinventoryInterval: process.env.SYNC_SUBINVENTORY_INTERVAL,
  syncInventoryOrganizationInterval:
  process.env.SYNC_INVENTORY_ORGANIZATION_INTERVAL,
  syncItemInterval: process.env.SYNC_ITEM_INTERVAL,
}));

export const syncSchema = {
  SYNCRONIZE: Joi.string()
    .valid('true', 'false')
    .default('false'),
  SYNC_LOCATOR_INTERVAL: Joi.number().default(5000),
  SYNC_SUBINVENTORY_INTERVAL: Joi.number().default(5000),
  SYNC_INVENTORY_ORGANIZATION_INTERVAL: Joi.number().default(5000),
  SYNC_ITEM_INTERVAL: Joi.number().default(5000),
};
