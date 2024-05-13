import * as React from "react";
import Alert from "@mui/material/Alert";
import MyButton from "../FormElements/MyButton";

export default function AlertBox({ type, message, actionButtons }) {
  return (
    <Alert 
      variant="outlined" 
      severity={type}
      action={actionButtons.map((button, index) => (
        <MyButton
          key={index}
          label={button.label}
          onClick={button.onClick}
        />
      ))
      }
      >
      {message}
    </Alert>
  );
}
