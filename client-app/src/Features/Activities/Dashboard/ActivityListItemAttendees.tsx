import React from 'react';
import { Image, List, Popup } from 'semantic-ui-react';
import { IAtendee } from '../../../App/Models/activitiy';

const ActivityListItemAttendees: React.FC<{ attendees: IAtendee[] }> = ({
  attendees
}) => {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <List.Item key={attendee.username}>
          <Popup
            header={attendee.displayName}
            trigger={
              <Image avatar src={attendee.image || '/Assests/user.png'} />
            }
          />
        </List.Item>
      ))}
    </List>
  );
};

export default ActivityListItemAttendees;
