import { createClient } from 'then-redis';
import fetch from 'node-fetch';
import moment from 'moment';

const defaultTtl = moment.duration(8, 'hours').as('seconds');

let db = null;
const devCache = {};

export default async function fetchText(
  url,
  { ttl = defaultTtl, headers = {}, method = 'get' } = {},
) {
  // XXX: Consider using fqdn
  headers.referer = (process.env.NODE_HOME !== '/app/.heroku/node') ?
    'localhost' : 'firefox-health-dashboard';
  console.log(headers);
  const key = `cache:${url}`;
  if (typeof ttl === 'string') {
    ttl = moment.duration(1, ttl).as('seconds');
  }
  if (process.env.REDIS_URL && !db) {
    db = createClient(process.env.REDIS_URL);
  }
  const cached = db ? await db.get(key) : devCache[key];
  if (cached) {
    return cached;
  }
  const response = await fetch(url, { method, headers });
  if (!response.ok) {
    console.error(`Response for ${url} not OK: ${response.status}`);
    console.log(await response.text());
    return null;
  }
  const text = await response.text();
  if (process.env.REDIS_URL) {
    db.set(key, text);
    db.expire(key, ttl);
  } else {
    devCache[key] = text;
  }
  return text;
}
