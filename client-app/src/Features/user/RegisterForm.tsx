import React, { useContext } from 'react';
import { RootStoreContext } from '../../App/stores/rootStore';
import { Form as FinalForm, Field } from 'react-final-form';
import { IUserFormValues } from '../../App/Models/user';
import { Form, Button, Header } from 'semantic-ui-react';
import TextInput from '../../App/common/form/TextInput';
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan,
  isAlphaNumeric
} from 'revalidate';
import { isRegExp } from 'util';
import ErrorMessage from '../../App/common/form/ErrorMessage';
import { FORM_ERROR } from 'final-form';

const validate = combineValidators({
  email: isRequired('email'),
  username: isRequired('username'),
  displayName: isRequired('displayName'),
  password: composeValidators(
    isRequired('password'),
    isAlphaNumeric('password'),
    hasLengthGreaterThan(6)({
      message: 'Description needs to be atleast 6 chars'
    })
  )()
});

const RegisterForm = () => {
  const userStore = useContext(RootStoreContext).userStore;
  return (
    <FinalForm
      validate={validate}
      onSubmit={(values: IUserFormValues) =>
        userStore.register(values).catch((err) => ({
          [FORM_ERROR]: err
        }))
      }
      render={({
        handleSubmit,
        pristine,
        invalid,
        submitError,
        dirtySinceLastSubmit,
        submitting
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header as='h2' content='Register to Reactivities' color='teal' />
          <Field name='email' component={TextInput} placeholder='Email' />
          <Field name='username' component={TextInput} placeholder='Username' />
          <Field
            name='displayName'
            component={TextInput}
            placeholder='Display Name'
          />
          <Field
            name='password'
            type='password'
            component={TextInput}
            placeholder='Password'
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage
              error={submitError}
              text={JSON.stringify(submitError.data.errors)}
            />
          )}
          <Button
            disabled={(pristine && !dirtySinceLastSubmit) || invalid}
            content='Register'
            color='teal'
            fluid
            loading={submitting}
          />
        </Form>
      )}
    />
  );
};

export default RegisterForm;
