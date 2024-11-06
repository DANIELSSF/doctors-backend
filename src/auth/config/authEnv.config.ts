import 'dotenv/config';
import * as joi from 'joi';

import { AuthEnvVars } from '../interfaces';

const envsSchema = joi
  .object({
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().required(),

    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_CLIENT_SECRET: joi.string().required(),
    GOOGLE_URL_CALLBACK: joi.string().required(),

    FRONTEND_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: AuthEnvVars = value;

export const authEnvs = {
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,

  oauth: {
   clientId: envVars.GOOGLE_CLIENT_ID,
   clientSecret: envVars.GOOGLE_CLIENT_SECRET,
   urlCallback: envVars.GOOGLE_URL_CALLBACK,
  },
  
  frontEnd: envVars.FRONTEND_URL,
};
