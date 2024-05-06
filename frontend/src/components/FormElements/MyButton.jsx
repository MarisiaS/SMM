import * as React from 'react';
import Button from '@mui/material/Button';
import '../../App.css'

export default function MyButton(props) {
    const {label,type, onClick} = props
  return (
      <Button type={type} variant="contained" className={"myButton"} onClick={onClick} style={{background: "lightskyblue", color:'black'}}>
            {label ?? props.children}
      </Button>

  );
}
