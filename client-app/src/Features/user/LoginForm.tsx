import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Form, Button, Label } from 'semantic-ui-react';
import TextInput from '../../App/common/form/TextInput';
import { RootStoreContext } from '../../App/stores/rootStore';
import { IUserFormValues } from '../../App/Models/user';
import { FORM_ERROR } from 'final-form';
import { combineValidators, isRequired } from 'revalidate';

const validate = combineValidators({
  email: isRequired('email'),
  password: isRequired('password')
});

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const userStore = rootStore.userStore;
  return (
    <FinalForm
      validate={validate}
      onSubmit={(values: IUserFormValues) =>
        userStore.login(values).catch((err) => ({
          [FORM_ERROR]: err
        }))
      }
      render={({
        handleSubmit,
        submitting,
        form,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit
      }) => (
        <Form onSubmit={handleSubmit}>
          <Field name='email' component={TextInput} placeholder='Email' />
          <Field
            name='password'
            component={TextInput}
            placeholder='Password'
            type='password'
          />
          {submitError && !dirtySinceLastSubmit && (
            <Label color='red' basic content={submitError.statusText} />
          )}
          <br />
          <Button
            positive
            loading={submitting}
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            content='login'
          />
          <pre>{JSON.stringify(form.getState(), null, 2)}</pre>
        </Form>
      )}
    />
  );
};

export default LoginForm;
