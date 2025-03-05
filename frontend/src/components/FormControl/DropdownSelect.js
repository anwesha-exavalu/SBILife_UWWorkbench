import React from "react";
import { Form, Select } from "antd";
import styled from "styled-components";
import { FormInputFeild } from "../../styles/components/FormControl";

const { Option } = Select;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 0; // Remove default margin

  .ant-form-item-label {
    
    
    label {
      color:rgb(195, 193, 193); // Grey color for label
      font-size: 14px;
      font-weight: 500;
    }
  }

  .ant-form-item-control-input-content {
    width: ${props => props.width || '100%'};
    
    .ant-select {
      width: 100%;
      height: ${props => props.height || '32px'};
    }
  }
`;

const DropdownSelect = ({
  theme,
  name,
  label,
  layout,
  rules = [], // Remove required prop
  placeholder = "",
  options = [],
  onChange,
  width,
  height,
  ...rest
}) => {
  return (
    <FormInputFeild  theme={theme}>
    <StyledFormItem
      name={name}
      label={label}
      layout={layout}
      width={width}
      height={height}
      rules={rules} // Use only provided rules
    >
      <Select 
        placeholder={placeholder} 
        {...rest} 
        onChange={onChange}
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </StyledFormItem></FormInputFeild>
  );
};

export default DropdownSelect;