import React, { Fragment, useContext, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import Navbar from '../../Features/Nav/Navbar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../Features/Activities/Dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import HomePage from '../../Features/home/HomePage';
import {
  Switch,
  Route,
  withRouter,
  RouteComponentProps
} from 'react-router-dom';
import ActivityForm from '../../Features/Activities/Form/ActivityForm';
import ActivityDetails from '../../Features/Activities/Details/ActivityDetails';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';
import LoginForm from '../../Features/user/LoginForm';
import { RootStoreContext } from '../stores/rootStore';
import Spinner from './Spinner';
import ModalContainer from '../common/modals/ModalContainer';
import DamiForm from '../common/form/DamiForm';
import ProfilePage from '../../Features/profiles/ProfilePage';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const commonStore = useContext(RootStoreContext).commonStore;
  const { setAppLoaded, token, appLoaded } = commonStore;
  const { getUser } = useContext(RootStoreContext).userStore;

  // get the current user based on the token that is in local storage
  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token]);

  if (!appLoaded) return <Spinner content='Loading App' />;

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position={'bottom-right'} />
      <Route exact path='/' component={HomePage} />
      {/* checks to see if the route is anything other than '/' and renders them */}
      <Route
        path={'/(.+)'}
        render={() => (
          <Fragment>
            <Navbar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route exact path='/activities' component={ActivityDashboard} />
                <Route
                  exact
                  path='/activities/:id'
                  component={ActivityDetails}
                />
                <Route
                  //the key attribute acts as a componentWillUnmont mthod, so it rerenders when the key changes
                  key={location.key}
                  exact
                  path={['/createActivity', '/manage/:id']}
                  component={ActivityForm}
                />
                  <Route exact path='/profile/:username' component={ProfilePage} />
                <Route exact path='/dami' component={DamiForm} />
                  
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
