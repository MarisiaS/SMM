import * as React from 'react';
import Button from '@mui/material/Button';

export default function MyButton(props) {
    const {label} = props;
    return (
        <Button variant="contained">
            {label}
        </Button>
    );
}
