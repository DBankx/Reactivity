import { RootStore } from './rootStore';
import { observable, action, reaction } from 'mobx';

export default class CommonStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    // reaction on the token to initialize the app if the token has changed or is gotten
    reaction(
      () => this.token,
      (token) => {
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
      }
    );
  }

  @observable token: string | null = localStorage.getItem('token');
  @observable appLoaded: boolean = false;

  //setting the token inside localstorage
  @action setToken = (token: string) => {
    this.token = token;
  };

  //delete the token from localStorage
  @action deleteToken = () => {
    localStorage.removeItem('token');
    this.token = null;
  };

  @action setAppLoaded = () => {
    this.appLoaded = true;
  };
}
