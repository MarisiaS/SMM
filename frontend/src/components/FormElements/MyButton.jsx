import * as React from "react";
import Button from "@mui/material/Button";

export default function MyButton(props) {
  const { label, type, onClick, disabled } = props;
  return (
    <Button
      type={type}
      variant="contained"
      className={"myButton"}
      onClick={onClick}
      disabled={disabled}
      startIcon={props.children}
      color="primary"
    >
      {label}
    </Button>
  );
}
