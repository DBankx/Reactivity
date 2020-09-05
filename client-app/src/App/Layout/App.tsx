import React, { useEffect, Fragment, useContext } from 'react';
import 'semantic-ui-css/semantic.min.css';
import Navbar from '../../Features/Nav/Navbar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../Features/Activities/Dashboard/ActivityDashboard';
import Spinner from './Spinner';
import ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';

function App() {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <Spinner content='Loading Activities...' />;

  return (
    <Fragment>
      <Navbar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
}

export default observer(App);
