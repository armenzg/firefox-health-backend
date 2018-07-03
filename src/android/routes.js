import Router from 'koa-router';
import NimbledroidHandler from './NimbledroidHandler';
import { getSpreadsheetValues } from '../utils/google';
import config from '../configuration';

export const router = new Router();

router
  .get('/klar', async (ctx) => {
    const { site } = ctx.request.query;
    const list = await getSpreadsheetValues({
      id: config.androidSpreadsheetId,
      range: site,
    });
    list.forEach((entry) => {
      entry.focus = parseFloat(entry.focus);
      entry.klar = parseFloat(entry.klar);
    });
    ctx.body = list;
  })
  .get('/nimbledroid', async (ctx) => {
    if (!process.env.NIMBLEDROID_API_KEY || !process.env.NIMBLEDROID_EMAIL) {
      ctx.throw(
        400,
        'You need to set Nimbledroid authentication for this endpoint to work. More info in ' +
        'https://github.com/mozilla/firefox-health-backend/blob/master/README.md',
      );
    }
    const handler = new NimbledroidHandler(
      process.env.NIMBLEDROID_EMAIL,
      process.env.NIMBLEDROID_API_KEY,
    );
    ctx.body = await handler.getNimbledroidData();
  });
