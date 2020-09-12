import React, { useContext } from 'react';
import { Item, Button, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import IActivity from '../../../App/Models/activitiy';
import ActivityStore from '../../../App/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';
import { RootStoreContext } from '../../../App/stores/rootStore';

interface IProps {
  activity: IActivity;
}

const ActivityListItem: React.FC<IProps> = ({ activity }) => {
  const rootStore = useContext(RootStoreContext);
  const activityStore = rootStore.activityStore;
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size='tiny' circular src='/Assests/user.png' />
            <Item.Content>
              <Item.Header as='a'>{activity.title}</Item.Header>
              <Item.Description>Hosted by Bob</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name='clock' />
        {format(activity.date, 'h:mm a')}
        <Icon name='marker' />
        {activity.venue}, {activity.city}
      </Segment>
      <Segment secondary>Attendees will go here</Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          floated='right'
          content='view'
          color='blue'
          as={Link}
          to={`/activities/${activity.id}`}
        />
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityListItem);
