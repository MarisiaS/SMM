import * as React from 'react';
import Button from '@mui/material/Button';
import '../../App.css'

export default function MyButton(props) {
    const {label} = props
  return (
      <Button variant="contained" className={'myForm'}>
        {label}
      </Button>
  );
}
