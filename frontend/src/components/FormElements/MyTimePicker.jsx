import * as React from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Controller } from "react-hook-form";
import { useState } from "react";

const MyTimePicker = (props) => {
  const { label, name, control, rules } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            ampm={false}
            format="HH:mm"
            views={["hours", "minutes"]}
            label={label}
            value={value}
            onChange={onChange}
            slotProps={{
              textField: {
                error: !!error,
                helperText: error?.message,
              },
            }}
            sx={{ minWidth: 250 }}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default MyTimePicker;
