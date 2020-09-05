import React, { useState, FormEvent, useContext } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import IActivity from '../../../App/Models/activitiy';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../App/stores/activityStore';
import { observer } from 'mobx-react-lite';

//renamed acitivity to intialformstate

const ActivityForm: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  //this function initializes the form with the activity passed down
  const initializeForm = () => {
    if (activityStore.selectedActivity!) {
      return activityStore.selectedActivity!;
    } else {
      return {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
      };
    }
  };

  const [activity, setAcitivity] = useState<IActivity>(initializeForm);

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
        activityStore.createActivity(newActivity);
      } else {
        activityStore.editActivity(activity);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    handleSubmitActivityToApi(activity);
  };

  return (
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
          onClick={() => activityStore.cancelEditMode()}
          type='button'
          content='cancel'
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
