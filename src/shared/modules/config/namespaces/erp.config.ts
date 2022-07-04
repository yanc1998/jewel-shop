import { registerAs } from '@nestjs/config';
import * as Joi from '@hapi/joi';

export const erpConfig = registerAs('erp', () => ({
  url: process.env.ERP_URL,
  urlSoap: process.env.ERP_URL_SOAP,
  version: process.env.ERP_VERSION,
  userName: process.env.ERP_USER_NAME,
  password: process.env.ERP_PASSWORD,
  employeeName: process.env.ERP_EMPLOYEE_NAME,
  soapUserName: process.env.ERP_SOAP_USERNAME,
  soapPassword: process.env.ERP_SOAP_PASSWORD,
}));

export const erpSchema = {
  ERP_URL: Joi.string().required(),
  ERP_URL_SOAP: Joi.string().required(),
  ERP_VERSION: Joi.string().required(),
  ERP_USER_NAME: Joi.string().required(),
  ERP_PASSWORD: Joi.string().required(),
  ERP_EMPLOYEE_NAME: Joi.string().required(),
  ERP_SOAP_USERNAME: Joi.string().required(),
  ERP_SOAP_PASSWORD: Joi.string().required(),
};
