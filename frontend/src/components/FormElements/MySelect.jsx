import * as React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from '@mui/material/MenuItem';
import { Controller } from "react-hook-form";

const MySelect = React.forwardRef((props, ref) => {
  const { label, name, control, options } = props;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={""}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          ref={ref}
          select
          onChange={onChange}
          value={value}
          label={label}
          variant="outlined"
          className={"myForm"}
          error={!!error}
          helperText={error?.message}
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
});

export default MySelect;
