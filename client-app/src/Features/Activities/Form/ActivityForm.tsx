import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import IActivity, {
  IActivityFormValues,
  ActivityFormValues
} from '../../../App/Models/activitiy';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../App/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../App/common/form/TextInput';
import TextAreaInput from '../../../App/common/form/TextAreaInput';
import SelectInput from '../../../App/common/form/SelectInput';
import { category } from '../../../App/common/options/categoryOptions';
import DateInput from '../../../App/common/form/DateInput';
import { combineDateAndTime } from '../../../App/common/util/util';
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan
} from 'revalidate';

interface DetailParams {
  id: string;
}

//validation using revalidate
const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be atleast 5 chars'
    })
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time')
});

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const activityStore = useContext(ActivityStore);

  // changed the state type from IActivity to ActivityFormValues class that implements the IActivityFormValues interface which makes all the fields optional,  therefore the values of the fields can be undefined and also it can map all the properties to an activity if present
  const [activity, setAcitivity] = useState(new ActivityFormValues());

  //local state for loading the activities into the inputs
  const [loading, setLoading] = useState<boolean>(false);

  //load activity to get activity from state or api, incase of a refresh, then set the activity state to the activity
  useEffect(() => {
    //check if there is an id in the url && there is not activity currently in the local state
    if (match.params.id) {
      setLoading(true);
      activityStore
        .loadActivity(match.params.id)
        .then((activity) => setAcitivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false));
    }
  }, [activityStore.loadActivity, match.params.id]);

  const handleFinalForm = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;
    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid()
      };
      activityStore.createActivity(newActivity);
    } else {
      activityStore.editActivity(activity);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            initialValues={activity}
            onSubmit={handleFinalForm}
            validate={validate}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  placeholder='Title'
                  name='title'
                  value={activity.title}
                  component={TextInput}
                />
                <Field
                  placeholder='Description'
                  value={activity.description}
                  name='description'
                  rows={4}
                  component={TextAreaInput}
                />
                <Field
                  placeholder='Category'
                  options={category}
                  value={activity.category}
                  name='category'
                  component={SelectInput}
                />
                <Form.Group widths='equal'>
                  <Field
                    placeholder='Date'
                    value={activity.date}
                    component={DateInput}
                    name='date'
                    date={true}
                  />
                  <Field
                    placeholder='Time'
                    value={activity.time}
                    component={DateInput}
                    name='time'
                    time={true}
                  />
                </Form.Group>
                <Field
                  placeholder='City'
                  value={activity.city}
                  component={TextInput}
                  name='city'
                />
                <Field
                  placeholder='Venue'
                  value={activity.venue}
                  component={TextInput}
                  name='venue'
                />
                <Button
                  floated='right'
                  positive
                  type='submit'
                  content='submit'
                  loading={activityStore.submitting}
                  disabled={loading || invalid || pristine}
                />
                <Button
                  floated='right'
                  onClick={
                    activity.id
                      ? () => history.push(`/activities/${activity.id}`)
                      : () => history.push('/activities')
                  }
                  type='button'
                  content='cancel'
                  disabled={loading}
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
