import axios, { AxiosResponse } from 'axios';
import IActivity from '../Models/activitiy';

//setting the base url to get the response
axios.defaults.baseURL = 'http://localhost:5000/api';

//response interceptor
axios.interceptors.response.use(undefined, (error) => {
  if (error.response.status === 404) {
    throw error.response;
  }
});

const responseBody = (response: AxiosResponse) => response.data;

//slow down the api call
const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => {
      resolve(response);
    }, ms)
  );

//setting structure of request for each verb
const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}, config: {}) =>
    axios.post(url, body, config).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}, config: {}) =>
    axios.put(url, body, config).then(sleep(1000)).then(responseBody),
  delete: (url: string) =>
    axios.delete(url).then(sleep(1000)).then(responseBody)
};

//constants for the activity feature
const Activities = {
  list: (): Promise<IActivity[]> => requests.get('/activities'),
  details: (id: string) => requests.get(`/activities/${id}`),
  delete: (id: string) => requests.delete(`/activities/${id}`),
  create: (activity: IActivity) =>
    requests.post('/activities', activity, {
      headers: { 'Content-Type': 'application/json' }
    }),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity, {
      headers: { 'Content-Type': 'application/json' }
    })
};

export default Activities;
