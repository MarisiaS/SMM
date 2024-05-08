import * as React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from '@mui/material/MenuItem';
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";

const MySelect = React.forwardRef((props, ref) => {
  const { label, name, control, getOptions } = props;
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let ignore = false;
    async function fetchOptions() { 
      try {
        const _options = await getOptions();
        if (!ignore){ 
          setOptions(_options);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
    return () => {
      ignore = true;
    };
  }, []);

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
          //className={"myForm"}
          error={!!error}
          helperText={error?.message}
        >
          {options && options.map((option) => (
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
