/* global afterEach describe, it */
import fetchMock from 'fetch-mock';
import superagent from 'supertest';
import app from '../../src/app';
import config from '../../src/configuration';

const KLAR_DATA = require('../mocks/nimbledroid.klar');

const request = () => superagent(app.listen());

describe('/android', () => {
  fetchMock.get(`${config.nimbledroidApiUrl}.klar/apks/38`, KLAR_DATA);

  describe('GET /api/android/nimbledroid/', () => {
    it('should return 400', (done) => {
      delete process.env.NIMBLEDROID_EMAIL;
      request()
        .get('/api/android/nimbledroid/')
        .expect(400, done);
    });

    it('should return 200', (done) => {
      request()
        .get('/api/android/nimbledroid/')
        .expect(200, done);
    });

    afterEach(() => {
      process.env.NIMBLEDROID_EMAIL = 'nobody@moz.com';
      process.env.NIMBLEDROID_API_KEY = 'foo_bar';
    });
  });
});
