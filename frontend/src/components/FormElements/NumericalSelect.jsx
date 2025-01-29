import * as React from "react";
import { Controller } from "react-hook-form";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";

const NumericalSelect = (props) => {
  const { label, name, control, min_value, max_value, rules } = props;
  const options = Array.from(
    { length: max_value - min_value + 1 },
    (_, index) => min_value + index
  );

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
            sx={{ minWidth: 250 }}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default NumericalSelect;
