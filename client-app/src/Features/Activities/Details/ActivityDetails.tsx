import React, { useContext, useEffect } from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../App/stores/activityStore';
import { RouteComponentProps, Link } from 'react-router-dom';
import Spinner from '../../../App/Layout/Spinner';

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
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);

  if (loadingInitial || activity === null)
    return <Spinner content='Loading activity...' />;

  return (
    <Card fluid>
      <Image
        src={`/Assests/categoryImages/${activity!.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
          <span>{activity!.date}</span>
        </Card.Meta>
        <Card.Description>{activity!.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            basic
            color='blue'
            content='Edit'
            as={Link}
            to={`/manage/${activity!.id}`}
          />
          <Button
            onClick={() => history.push('/activities')}
            basic
            color='grey'
            content='Cancel'
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivityDetails);
