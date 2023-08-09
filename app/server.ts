import 'dotenv/config';
import path from 'path';
import express, { Request, Response } from 'express';
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

const mainStore = new MemoryStore();
const authenticatedStore = new MemoryStore();
const unauthenticatedStore = new MemoryStore();

const main = mainApp('main', secret, ttl, secure, mainStore);
const authenticated = subApp('auth', secret, ttl, secure, authenticatedStore);
const unauthenticated = subApp('unauth', secret, ttl, secure, unauthenticatedStore);

const getStore = (store: string) => {
  if(store === 'authenticated') {
    return authenticatedStore;
  }

  if(store === 'unauthenticated') {
    return unauthenticatedStore;
  }
}

expressApp.use('/unauthenticated/', unauthenticated);
expressApp.use('/authenticated/', authenticated);
expressApp.get('/destroy', (req: Request, res: Response) => {
  const sid = req.query.sid as string;
  if(!sid) {
    res.status(400).send('sid is required');
    return;
  }
  
  const store = req.query.store as string;
  if(!store) {
    res.status(400).send('store is required');
    return;
  }
  
  if(store !== 'unauthenticated' && store !== 'authenticated') {
    res.status(400).send('store must be either \'authenticated\' or \'unauthenticated\'');
    return;
  }
  
  getStore(store).destroy(sid, (err) => {
    if(err) {
      res.status(400).send(`failed to destroy session with sid ${sid} for store ${store}`);
      return;
    }

    res.send(`successfully destroyed session with sid ${sid} for store ${store}`);
  });
});
expressApp.use('/', main);

expressApp.listen(port, () => {
  console.log(`running on port: ${port}`);
});
