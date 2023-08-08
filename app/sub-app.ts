import path from 'path';
import helmet from 'helmet';
import { Store } from 'express-session';
import { configure, Plan, waypointUrl } from "@dwp/govuk-casa";
import express, { Request, Response } from 'express';
import { MemoryStore } from 'express-session';

import nameFields from './fields/name';
import feelingsFields from './fields/feelings';

const authenticated = (
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
  plan.addSequence('name', 'feelings', 'url:///start/');

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
        waypoint: 'name',
        view: 'pages/name.njk',
        fields: nameFields
      },
      {
        waypoint: 'feelings',
        view: 'pages/feelings.njk',
        fields: feelingsFields,
      }
    ],
    plan
  });

  ancillaryRouter.use('/start', (req: Request, res: Response) => {
    const str = (req as any).session.journeyContextList;
    console.log(JSON.stringify(str, null, 4));
    res.render('pages/start.njk');
  });

  return mount(casaApp, {});
}

export default authenticated;
