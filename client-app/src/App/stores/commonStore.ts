import { RootStore } from './rootStore';
import { observable, action } from 'mobx';

export default class CommonStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable token: string | null = null;
  @observable appLoaded: boolean = false;

  //setting the token inside localstorage
  @action setToken = (token: string) => {
    localStorage.setItem('token', token);
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
