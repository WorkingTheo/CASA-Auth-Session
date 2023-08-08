import path from 'path';
import helmet from 'helmet';
import { Store } from 'express-session';
import { configure, Plan } from "@dwp/govuk-casa";
import express, { Request, Response } from 'express';
import { MemoryStore } from 'express-session';

const app = (
  name: string,
  secret: string,
  ttl: number,
  secure: boolean,
) => {
  const casaApp = express();
  casaApp.use(helmet.noSniff());

  const store = new MemoryStore();

  const viewDir = path.join(__dirname, './views/');
  const localesDir = path.join(__dirname, './locales/');

  const plan = new Plan();

  const { mount, ancillaryRouter } = configure({
    views: [viewDir],
    i18n: {
      dirs: [localesDir],
      locales: ['en'],
    },
    session: {
      name,
      secret,
      ttl,
      secure,
      store,
    },
    pages: [
      {
        waypoint: 'start',
        view: 'pages/start.njk'
      }
    ],
    plan
  });

  ancillaryRouter.use('/start', (req: Request, res: Response) => {
    res.render('pages/start.njk');
  });

  return mount(casaApp, {});
}

export default app;
