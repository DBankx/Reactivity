import React from 'react';
import { Grid } from 'semantic-ui-react';
import IActivity from '../../../App/Models/activitiy';
import ActivityList from './ActivityList';
import ActivityDetails from '../Details/ActivityDetails';
import ActivityForm from '../Form/ActivityForm';

interface IProps {
  activities: IActivity[];
  //pass the signature of the function being drilled
  selectActivity: (id: string) => void;
  activity: IActivity | null;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (activity: IActivity | null) => void;
  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
  deleteActivity: (id: string) => void;
}

const ActivityDashboard: React.FC<IProps> = ({
  activities,
  selectActivity,
  activity,
  editMode,
  setEditMode,
  setSelectedActivity,
  createActivity,
  editActivity,
  deleteActivity
}) => {
  return (
    <div>
      <Grid>
        <Grid.Column width={10}>
          <ActivityList
            activities={activities}
            selectActivity={selectActivity}
            deleteActivity={deleteActivity}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          {activity && !editMode && (
            <ActivityDetails
              activity={activity}
              setEditMode={setEditMode}
              setSelectedActivity={setSelectedActivity}
            />
          )}
          {editMode && (
            // key causes a re render of the component
            <ActivityForm
              key={activity ? activity.id || 0 : null}
              setEditMode={setEditMode}
              activity={activity!}
              createActivity={createActivity}
              editActivity={editActivity}
            />
          )}
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default ActivityDashboard;
