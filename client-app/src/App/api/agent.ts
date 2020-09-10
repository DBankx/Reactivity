import axios, { AxiosResponse } from 'axios';
import IActivity from '../Models/activitiy';
import { history } from '../..';
import { toast } from 'react-toastify';

//setting the base url to get the response
axios.defaults.baseURL = 'http://localhost:5000/api';

//response interceptors for error handling
axios.interceptors.response.use(undefined, (error) => {
  //checks for network error by checking the message and if there is no response object
  if (error.message === 'Network Error' && !error.response) {
    toast.error('Network Error - Check your connection');
  }
  //redirect to notfound page for bad guids
  if (error.response.status === 404) {
    history.push('/notfound');
  }
  //redirect to notfound page for invalid id guid
  if (
    error.response.status === 400 &&
    error.response.config.method == 'get' &&
    error.response.data.errors.hasOwnProperty('id')
  ) {
    history.push('/notfound');
  }
  //send a toast notification if any response is a 500 status code
  if (error.response.status === 500) {
    toast.error('Server error - Try reloading the page');
  }
  throw error;
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
