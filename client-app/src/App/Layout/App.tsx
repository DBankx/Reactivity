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

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
      <Route exact path='/' component={HomePage} />
      {/* checks to see if the route is anything other than '/' and renders them */}
      <Route
        path={'/(.+)'}
        render={() => (
          <Fragment>
            <Navbar />
            <Switch>
              <Container style={{ marginTop: '7em' }}>
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
              </Container>
            </Switch>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
