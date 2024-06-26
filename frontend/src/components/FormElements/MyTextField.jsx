import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

const MyTextField = React.forwardRef((props, ref) => {
    const { label, name, control } = props;

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={''}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                    ref={ref}
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
});

export default MyTextField;