import * as React from "react";
import { Controller } from "react-hook-form";
import { Select, MenuItem, InputLabel } from "@mui/material";

const MySelect = (props) => {
  const { label, name, control, options, rules } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div>
          <InputLabel>{label}</InputLabel>
          <Select value={value} onChange={onChange} label={label}>
            {options &&
              options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </Select>
        </div>
      )}
    />
  );
};

export default MySelect;

// SelectComponent.jsx
import React from "react";

