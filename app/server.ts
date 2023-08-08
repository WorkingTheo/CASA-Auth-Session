import 'dotenv/config';
import path from 'path';
import express from 'express';
import { noSniff } from 'helmet';
import { AppConfig } from 'environment';
import { MemoryStore } from 'express-session';

import mainApp from './main-app';
import subApp from './sub-app';

const expressApp = express();
expressApp.use(noSniff());

expressApp.use('/css', express.static(path.resolve(__dirname, './public/css')));
expressApp.use('/assets/js', express.static(path.resolve(__dirname, './public/javascript')));
expressApp.use('/assets/images', express.static(path.resolve(__dirname, './public/images')));
expressApp.use('/assets/fonts', express.static(path.resolve(__dirname, './public/fonts')));

const appConfig = { ...process.env as AppConfig };
const name = appConfig.SESSION_ID;
const secret = appConfig.SESSIONS_SECRET;
const ttl = parseInt(appConfig.SESSIONS_TTL_SECONDS);
const secure = appConfig.SECURE_COOKIES === 'true';
const casaMountUrl = appConfig.CASA_MOUNT_URL;
const port = parseInt(appConfig.SERVER_PORT);

const main = mainApp('main', secret, ttl, secure);
const unauthenticated = subApp('unauth', secret, ttl, secure);
const authenticated = subApp('auth', secret, ttl, secure);

expressApp.use('/unauthenticated/', unauthenticated);
expressApp.use('/authenticated/', authenticated);
expressApp.use('/', main);

expressApp.listen(port, () => {
  console.log(`running on port: ${port}`);
});
