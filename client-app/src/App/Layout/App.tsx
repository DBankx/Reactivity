import React, { useState, useEffect, Fragment, SyntheticEvent } from 'react';
import 'semantic-ui-css/semantic.min.css';
import IActivity from '../Models/activitiy';
import Navbar from '../../Features/Nav/Navbar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../Features/Activities/Dashboard/ActivityDashboard';
import Activities from '../api/agent';
import Spinner from './Spinner';

function App() {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<string>('');

  async function fetchApi() {
    try {
      await Activities.list()
        .then((res) => {
          //loop through the data and change the date time to remove presicion
          let activities: IActivity[] = [];
          res.forEach((activity) => {
            activity.date = activity.date.split('.')[0];
            activities.push(activity);
          });
          setActivities(activities);
        })
        .then(() => setLoading(false));
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

  const [submitting, setSubmitting] = useState(false);

  //delete an activity
  const handleDeleteActivity = (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    Activities.delete(id)
      .then(() =>
        setActivities([...activities.filter((activity) => activity.id !== id)])
      )
      .then(() => setSubmitting(false));
  };

  useEffect(() => {
    fetchApi();
  }, []);

  if (loading) return <Spinner content='Loading Activities...' />;

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
          submitting={submitting}
          target={target}
        />
      </Container>
    </Fragment>
  );
}

export default App;
