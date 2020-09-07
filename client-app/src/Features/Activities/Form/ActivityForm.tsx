import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import IActivity from '../../../App/Models/activitiy';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../App/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const activityStore = useContext(ActivityStore);

  const [activity, setAcitivity] = useState<IActivity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  });

  //load activity to get activity from state or api, incase of a refresh, then set the activity state to the activity
  useEffect(() => {
    //check if there is an id in the url && there is not activity currently in the local state
    if (match.params.id && activity.id.length === 0) {
      activityStore
        .loadActivity(match.params.id)
        .then(
          () => activityStore.activity && setAcitivity(activityStore.activity)
        );
    }
    //cleanup function to clear activity from state
    return () => {
      activityStore.clearActivity();
    };
  }, [
    activityStore.loadActivity,
    match.params.id,
    activityStore,
    activity.id.length,
    activityStore.clearActivity
  ]);

  function handleActivity(
    e: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.currentTarget;
    setAcitivity({ ...activity, [name]: value });
  }

  //function to handle the submit to api
  const handleSubmitActivityToApi = async (activity: IActivity) => {
    try {
      if (activity.id.length === 0) {
        let newActivity = {
          ...activity,
          id: uuid()
        };
        activityStore.createActivity(newActivity).then(() => {
          history.push(`/activities/${newActivity.id}`);
        });
      } else {
        activityStore.editActivity(activity).then(() => {
          history.push(`/activities/${activity.id}`);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    handleSubmitActivityToApi(activity);
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Form.Input
              placeholder='Title'
              name='title'
              value={activity.title}
              onChange={handleActivity}
            />
            <Form.TextArea
              rows={2}
              placeholder='Description'
              value={activity.description}
              onChange={handleActivity}
              name='description'
            />
            <Form.Input
              placeholder='Category'
              value={activity.category}
              onChange={handleActivity}
              name='category'
            />
            <Form.Input
              type='datetime-local'
              placeholder='Date'
              value={activity.date}
              onChange={handleActivity}
              name='date'
            />
            <Form.Input
              placeholder='City'
              value={activity.city}
              onChange={handleActivity}
              name='city'
            />
            <Form.Input
              placeholder='Venue'
              value={activity.venue}
              onChange={handleActivity}
              name='venue'
            />
            <Button
              floated='right'
              positive
              type='submit'
              content='submit'
              loading={activityStore.submitting}
            />
            <Button
              floated='right'
              onClick={() => history.push('/activities')}
              type='button'
              content='cancel'
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
