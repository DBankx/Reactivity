import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Select, Form, Label } from 'semantic-ui-react';

interface IProps
  extends FieldRenderProps<string, HTMLElement>,
    FormFieldProps {}

const SelectInput: React.FC<IProps> = ({
  meta: { touched, error },
  placeholder,
  width,
  options,
  input
}) => {
  return (
    <Form.Field width={width} error={touched && !!error}>
      <Select
        value={input.value}
        onChange={(e, data) => input.onChange(data.value)}
        placeholder={placeholder}
        options={options}
      />
      {touched && error && <Label>{error}</Label>}
    </Form.Field>
  );
};

export default SelectInput;
