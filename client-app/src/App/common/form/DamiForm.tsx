import React, { Fragment } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Header, Form, Button } from 'semantic-ui-react';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import { combineValidators, isRequired } from 'revalidate';

const validator = combineValidators({
  description: isRequired('minato'),
  password: isRequired('password'),
  email: isRequired('email')
});

const DamiForm = () => {
  return (
    <Fragment>
      <Header as='h2' content='damis form' />
      <FinalForm
        validate={validator}
        onSubmit={(values: any) =>
          setTimeout(() => {
            console.log(values);
          }, 1000)
        }
        render={({ handleSubmit, form, pristine, invalid, submitting }) => (
          <Form onSubmit={handleSubmit}>
            <Field name='email' placeholder='Email' component={TextInput} />
            <Field
              name='description'
              placeholder='Tell us something good'
              row={5}
              component={TextAreaInput}
            />
            <Field
              name='password'
              type='password'
              placeholder='Password'
              component={TextInput}
            />
            <Button
              positive
              content='Submit form'
              fluid
              loading={submitting}
              disabled={pristine || invalid}
            />
            <pre>{JSON.stringify(form.getState(), null, 2)}</pre>
          </Form>
        )}
      />
    </Fragment>
  );
};

export default DamiForm;
