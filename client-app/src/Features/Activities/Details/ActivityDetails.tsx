import React, { useContext, useEffect } from 'react';
import { Card, Image, Button, Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../App/stores/activityStore';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom';
import Spinner from '../../../App/Layout/Spinner';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSideBar from './ActivityDetailedSideBar';

interface IProps {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<IProps>> = ({
  match,
  history
}) => {
  const activityStore = useContext(ActivityStore);
  const { activity, loadingInitial, loadActivity } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id).catch(() => {
      history.push('/notFound');
    });
  }, [loadActivity, match.params.id, history]);

  if (loadingInitial || activity === null) {
    return <Spinner content='Loading activity...' />;
  }
  if (!activity) {
    return <h2>Error</h2>;
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSideBar />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
