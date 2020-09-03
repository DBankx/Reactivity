import React, { useState, FormEvent } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import IActivity from '../../../App/Models/activitiy';
import axios from 'axios';

interface IProps {
  setEditMode: (editMode: boolean) => void;
  activity: IActivity;
}

//renamed acitivity to intialformstate

const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  activity: initialFormState
}) => {
  //this function initializes the form with the activity passed down
  const initializeForm = () => {
    if (initialFormState) {
      return initialFormState;
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

  const submitToApi = async (activity: IActivity) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      await axios.put(
        `http://localhost:5000/api/activities/${activity.id}`,
        activity,
        config
      );
      console.log('Success');
    } catch (err) {
      console.error(err.message);
      console.log('Error Occured');
    }
  };

  const handleSubmit = () => {
    submitToApi(activity);
  };

  return (
    <Segment clearing>
      <Form
        onSubmit={(e: any) => {
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
          type='date'
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
        <Button floated='right' positive type='submit' content='submit' />
        <Button
          floated='right'
          onClick={() => setEditMode(false)}
          type='button'
          content='cancel'
        />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
