import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const api = axios.create();
const ONE_SECOND = 1000;
const mock = new MockAdapter(api);
const timeoutMap: Record<string, number> = {};
const runUrlRegex = new RegExp('tasks/(.+)/run');
const cancelUrlRegex = new RegExp('tasks/(.+)/cancel');

mock.onPost(runUrlRegex).reply((config) => {
  const result = config.url?.match(runUrlRegex);
  if (!result) {
    return [400, { error: 'Invalid URL' }];
  }

  const id = result[1];
  const delay = Math.random() * ONE_SECOND * 30 + ONE_SECOND * 30;
  const interval = ONE_SECOND * 5;
  return new Promise((resolve) => {
    let progress = 0;
    const timeoutId = setInterval(() => {
      progress += interval;
      const percentage = (progress / delay) * 100;

      if (percentage < 100) {
        if (config.onUploadProgress) {
          config.onUploadProgress({
            loaded: Math.floor(percentage),
            bytes: 0,
            lengthComputable: false,
          });
        }
      } else {
        resolve([200, {}]);
        clearInterval(timeoutId);
        delete timeoutMap[id];
      }
    }, interval);
    timeoutMap[id] = timeoutId;
  });
});

mock.onPost(cancelUrlRegex).reply((config) => {
  const result = config.url?.match(cancelUrlRegex);
  if (!result) {
    return [400, { error: 'Invalid URL' }];
  }

  const id = result[1];
  const timeoutId = timeoutMap[id];
  if (timeoutId) {
    clearInterval(timeoutId);
    delete timeoutMap[id];
  }
  return [200, {}];
});

export default api;
