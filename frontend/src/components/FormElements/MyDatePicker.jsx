import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller } from 'react-hook-form';

const MyDatePicker = React.forwardRef((props, ref) => {
    const { label, name, control, disablePast, disableFuture} = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            ref={ref}
            label={label}
            value={value}
            onChange={onChange}
            views={['month', 'day', 'year']}
            disablePast={disablePast}
            disableFuture={disableFuture}
            error={!!error}
            helperText={error?.message}
          />
        </LocalizationProvider>
      )}
    />
  );
});

export default MyDatePicker;
