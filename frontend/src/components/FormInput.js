import React from "react";
import { Form, Input } from "antd";
import { FormInputFeild } from "../styles/components/FormControl/index";

const FormInput = ({
  theme,
  name,
  label,
  rules = [],
  value,
  required,
  layout = "vertical", // Set vertical as default layout
  onChange,
  defaultValue,
  placeholder = "",
  ...rest
}) => {
  return (
    <FormInputFeild theme={theme}>
      <Form.Item
        name={name}
        label={label}
        layout={layout}
        labelCol={{ span: 24 }} // Make label take full width
        wrapperCol={{ span: 24 }} // Make input take full width
        rules={[
          ...(required
            ? [{ required: true, message: `Please enter ${name}!` }]
            : []),
          ...rules,
        ]}
      >
        <Input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
          {...rest}
        />
      </Form.Item>
    </FormInputFeild>
  );
};

export default FormInput;