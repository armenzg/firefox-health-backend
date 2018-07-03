/* global Headers */
import fetchJson from '../fetch/json';
import config from '../configuration';

const apiUrl = (product, buildId) => `${config.nimbledroidApiUrl}.${product}/apks/${buildId}`;

const generateAuthKey = (email, apiKey) => (
  Buffer.from(`${email}:${apiKey}`).toString('base64')
);

class NimbledroidHandler {
  constructor(apiKey, email) {
    this.apiKey = apiKey;
    this.email = email;
    if (!apiKey || !email) {
      throw Error('You need to instantite with an apiKey and email address.');
    }
  }

  async getNimbledroidData() {
    // XXX: Hardcoding will be handled on following commits
    return this.fetchData('klar', 38);
  }

  async fetchData(product, buildId) {
    return fetchJson(
      apiUrl(product, buildId),
      { method: 'GET', headers: this.generateAuthHeaders() },
    );
  }

  generateAuthHeaders() {
    return ({
      Authorization: `Basic ${generateAuthKey(this.email, this.apiKey)}`,
    });
  }
}

export default NimbledroidHandler;
