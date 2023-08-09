import path from 'path';
import helmet from 'helmet';
import { Store } from 'express-session';
import { configure, Plan } from "@dwp/govuk-casa";
import express, { NextFunction, Request, Response } from 'express';

const app = (
  name: string,
  secret: string,
  ttl: number,
  secure: boolean,
  store: Store,
) => {
  const casaApp = express();
  casaApp.use(helmet.noSniff());

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
      },
      {
        waypoint: 'logout',
        view: 'pages/logout.njk'
      }
    ],
    hooks: [{
      hook: 'journey.prerender',
      middleware: (req: Request, res: Response, next: NextFunction) => {
        console.log(`About to render ${req.path} ...`);
        console.log(`Main App Session ID: ${req.sessionID}`);
        next();
      },
    }],  
    plan
  });

  ancillaryRouter.use('/start', (req: Request, res: Response) => {
    res.render('pages/start.njk');
  });

  ancillaryRouter.use('/logout', (req: Request, res: Response) => {
    res.render('pages/logout.njk');
  });

  return mount(casaApp, {});
}

export default app;
