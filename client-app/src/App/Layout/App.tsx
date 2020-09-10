import React, { Fragment } from 'react';
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

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
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
