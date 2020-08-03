import 'dotenv/config';

import { cleanEnv, str, port, bool, url } from "envalid";
import { envConfig } from "./envConfig";
import { httpConfig } from "./httpConfig";
import { Context } from '@datacentricdesign/types';

function validateEnv() {
  cleanEnv(process.env, {
    // Host folder where to store the data
    HOST_DATA_FOLDER: str(),
    // Environment
    NODE_ENV: str(),
    // HTTP Settings
    HTTP_HOST: str(),
    HTTP_PORT: port(),
    HTTP_SECURED: bool(),
    HTTP_BASE_URL: str()
  });

}

validateEnv()

export default {
  homeDataFolder: process.env.HOME_DATA_FOLDER,
  jwtSecret: process.env.JWT_SECRET,
  env: envConfig,
  http: httpConfig
};

// Setup context of Request to pass user info once identified

declare global {
  namespace Express {
    interface Request {
      context: Context
    }
  }
}
