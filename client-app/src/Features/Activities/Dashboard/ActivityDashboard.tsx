import React, { useContext } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import ActivityDetails from '../Details/ActivityDetails';
import ActivityForm from '../Form/ActivityForm';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../App/stores/activityStore';

const ActivityDashboard: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const { editMode, selectedActivity } = activityStore;
  return (
    <div>
      <Grid>
        <Grid.Column width={10}>
          <ActivityList />
        </Grid.Column>
        <Grid.Column width={6}>
          {selectedActivity && !editMode && <ActivityDetails />}
          {editMode && (
            // key causes a re render of the component
            <ActivityForm
              key={selectedActivity ? selectedActivity.id || 0 : null}
            />
          )}
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default observer(ActivityDashboard);
