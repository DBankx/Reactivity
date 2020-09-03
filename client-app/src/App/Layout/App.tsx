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
      console.log(res.data);
      setActivities(res.data);
    } catch (err) {
      console.log('There was a problem');
    }
  }

  //filters the activities array for an activity and set that as the new selected activity
  const handleSelectedActivity = (id: string) => {
    setSelectedActivity(activities.filter((activity) => activity.id === id)[0]);
  };

  //function to create activity by setting edit action to true
  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
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
        />
      </Container>
    </Fragment>
  );
}

export default App;
