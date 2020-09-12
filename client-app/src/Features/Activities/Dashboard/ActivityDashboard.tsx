import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../App/stores/activityStore';
import Spinner from '../../../App/Layout/Spinner';
import { RootStoreContext } from '../../../App/stores/rootStore';

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);

  const activityStore = rootStore.activityStore;

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <Spinner content='Loading Activities...' />;
  return (
    <div>
      <Grid>
        <Grid.Column width={10}>
          <ActivityList />
        </Grid.Column>
        <Grid.Column width={6}>
          <h2>Activity Filters</h2>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default observer(ActivityDashboard);
