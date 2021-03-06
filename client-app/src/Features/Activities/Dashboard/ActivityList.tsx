import React, { useContext, Fragment } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityListItem from './ActivityListItem';
import { RootStoreContext } from '../../../App/stores/rootStore';
import { format } from 'date-fns';

const ActivityList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const activityStore = rootStore.activityStore;

  const { activitiesByDate } = activityStore;
  return (
    <Fragment>
      {activitiesByDate.map(([date, activities]) => (
        <Fragment key={date}>
          <Label size='large' color='blue'>
            {date}
          </Label>
          <Item.Group divided>
            {activities.map((activity) => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
