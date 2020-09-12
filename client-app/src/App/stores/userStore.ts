import { configure, observable, action, computed, runInAction } from 'mobx';
import { IUser, IUserFormValues } from '../Models/user';
import { User } from '../api/agent';
import { RootStore } from './rootStore';
import { history } from '../..';

//this affects all the stores if put into one store
configure({ enforceActions: 'always' });

class UserStore {
  rootStore: RootStore;

  constructor(rootstore: RootStore) {
    this.rootStore = rootstore;
  }
  @observable user: IUser | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await User.login(values);
      runInAction('Login user', () => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.commonStore.setAppLoaded();
      history.push('/activities');
    } catch (err) {
      throw err;
    }
  };

  @action logout = () => {
    this.user = null;
    this.rootStore.commonStore.deleteToken();
    history.push('/');
  };
}

export default UserStore;
