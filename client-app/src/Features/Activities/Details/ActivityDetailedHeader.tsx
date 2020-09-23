import React, { useContext } from 'react';
import { Segment, Item, Button, Header, Image } from 'semantic-ui-react';
import IActivity from '../../../App/Models/activitiy';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { RootStoreContext } from '../../../App/stores/rootStore';

const activityImageStyle = {
  filter: 'brightness(30%)'
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

const ActivityDetailedHeader: React.FC<{ activity: IActivity }> = ({
  activity
}) => {
  const { attendActivity, cancelAttendance, loading } = useContext(
    RootStoreContext
  ).activityStore;

  const host = activity.attendees.filter((x) => x.isHost)[0];

  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
        <Image
          style={activityImageStyle}
          src={`/Assests/categoryImages/${activity.category}.jpg`}
          fluid
        />
        <Segment basic style={activityImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size='huge'
                  content={activity.title}
                  style={{ color: 'white' }}
                />
                <p>{format(activity.date, 'eeee do MMMM')}</p>
                <p>
                  Hosted by <Link to={`/profile/${host.username}`}><strong>{host.displayName}</strong></Link>  
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
        {activity.isHost ? (
          <Button
            as={Link}
            to={`/manage/${activity.id}`}
            color='orange'
            floated='right'
          >
            Manage Event
          </Button>
        ) : activity.isGoing ? (
          <Button loading={loading} negative onClick={() => cancelAttendance()}>
            Cancel attendance
          </Button>
        ) : (
          <Button
            color='teal'
            loading={loading}
            onClick={() => attendActivity()}
          >
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailedHeader);
