import * as React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";

const MySelect = (props) => {
  const { label, name, control, options, rules } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          select
          onChange={onChange}
          value={value}
          label={label}
          variant="outlined"
          className={"myForm"}
          error={!!error}
          helperText={error?.message}
        >
          {options &&
            options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
        </TextField>
      )}
    />
  );
};

export default MySelect;
