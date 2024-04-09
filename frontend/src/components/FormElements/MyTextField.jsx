import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function MyTextField(props) {
    const {label} = props;
    return (
        <TextField 
            id="outlined-basic"
            label={label}
            variant="outlined" 
        />
    );
}
