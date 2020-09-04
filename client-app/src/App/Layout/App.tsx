import React, { useState, useEffect, Fragment } from 'react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import IActivity from '../Models/activitiy';
import Navbar from '../../Features/Nav/Navbar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../Features/Activities/Dashboard/ActivityDashboard';

function App() {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState<boolean>(false);

  async function fetchApi() {
    try {
      const res = await axios.get<IActivity[]>(
        'http://localhost:5000/api/activities'
      );
      //loop through the data and change the date time to remove presicion
      let activities: IActivity[] = [];
      res.data.forEach((activity) => {
        activity.date = activity.date.split('.')[0];
        activities.push(activity);
      });
      setActivities(activities);
    } catch (err) {
      console.log('There was a problem');
    }
  }

  //filters the activities array for an activity and set that as the new selected activity
  const handleSelectedActivity = (id: string) => {
    setSelectedActivity(activities.filter((activity) => activity.id === id)[0]);
    setEditMode(false);
  };

  //function to create activity by setting edit action to true
  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  //function to submit an activity
  const handleCreateActivity = (activity: IActivity) => {
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  };

  //function to edit activity
  const handleEditActivity = (activity: IActivity) => {
    setActivities([
      ...activities.filter((x) => x.id !== activity.id),
      activity
    ]);
    setSelectedActivity(activity);
    setEditMode(false);
  };

  //delete an activity
  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter((activity) => activity.id !== id)]);
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <Fragment>
      <Navbar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectedActivity}
          activity={selectedActivity!}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </Fragment>
  );
}

export default App;
