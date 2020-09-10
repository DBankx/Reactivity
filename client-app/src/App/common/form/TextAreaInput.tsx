import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';

interface IProps
  extends FieldRenderProps<string, HTMLElement>,
    FormFieldProps {}

const TextAreaInput: React.FC<IProps> = ({
  width,
  rows,
  meta: { touched, error },
  placeholder,
  input
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <textarea {...input} placeholder={placeholder} rows={rows} />
      {touched && error && (
        <Label color='red' basic>
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default TextAreaInput;
