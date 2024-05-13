import * as React from "react";
import Button from "@mui/material/Button";
import "../../App.css";

export default function MyButton(props) {
  const { label, type, onClick, disabled } = props;
  const backgroundColor = disabled ? "lightgrey" : "lightskyblue";
  return (
    <Button
      type={type}
      variant="contained"
      className={"myButton"}
      onClick={onClick}
      disabled={disabled}
      style={{ background: backgroundColor, color: "black" }}
    >
      {label ?? props.children}
    </Button>
  );
}
