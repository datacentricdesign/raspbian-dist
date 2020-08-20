import 'dotenv/config';

import { cleanEnv, str, port, bool, url, num } from "envalid";
import { envConfig } from "./envConfig";
import { httpConfig } from "./httpConfig";
import { Context } from '@datacentricdesign/types';
import { dpiConfig } from './dpiConfig';

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
    HTTP_BASE_URL: str(),
    //DPi default Settings
    IMG_NAME: str(),
    KEYBOARD_LAYOUT: str(),
    KEYBOARD_KEYMAP: str(),
    TIMEZONE_DEFAULT: str(),
    ENABLE_SSH: str(),
    LOCALE_DEFAULT: str()
  });

}

validateEnv()

export default {
  hostDataFolder: process.env.HOST_DATA_FOLDER,
  jwtSecret: process.env.JWT_SECRET,
  env: envConfig,
  http: httpConfig,
  dpi: dpiConfig
};

// Setup context of Request to pass user info once identified

declare global {
  namespace Express {
    interface Request {
      context: Context
    }
  }
}
