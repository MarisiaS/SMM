import * as React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Controller } from "react-hook-form";
import ClearIcon from "@mui/icons-material/Clear";

const CleanableTextField = (props) => {
  const { label, name, control, setValue, onSubmit } = props;

  const clearTextField = () => {
    setValue(name, "");
    onSubmit();
  };
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={""}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          id="outlined-basic"
          sx={{ minWidth: 250 }}
          onChange={onChange}
          value={value}
          label={label}
          variant="outlined"
          className={"myForm"}
          error={!!error}
          helperText={error?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={clearTextField}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export default CleanableTextField;
