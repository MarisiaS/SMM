import * as React from "react";
import { Controller } from "react-hook-form";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";

const MySelect = (props) => {
  const { label, name, control, options, rules } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error} variant="outlined">
          <InputLabel>{label}</InputLabel>
          <Select
            value={value}
            onChange={onChange}
            label={label}
            sx={{ minWidth: 150 }}
          >
            {options &&
              options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default MySelect;
