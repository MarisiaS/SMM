import * as React from "react";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

const MyTextField = (props) => {
  const { label, name, control, rules } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          id="outlined-basic"
          onChange={onChange}
          value={value}
          label={label}
          variant="outlined"
          className={"myForm"}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
};

export default MyTextField;
