import * as React from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Controller } from "react-hook-form";

const MyTimePicker = React.forwardRef((props, ref) => {
  const { label, name, control } = props;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={dayjs('2022-04-17T12:00')}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              ref={ref}
              label={label}
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error?.message}
            />
        </LocalizationProvider>
      )}
    />
  );
});

export default MyTimePicker;
