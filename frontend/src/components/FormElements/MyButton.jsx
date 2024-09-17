import * as React from "react";
import { Button, useTheme } from "@mui/material";

export default function MyButton(props) {
  const { label, type, onClick, disabled } = props;
  const theme = useTheme();
  return (
    <Button
      type={type}
      variant="contained"
      className={"myButton"}
      onClick={onClick}
      disabled={disabled}
      startIcon={props.children}
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
        minWidth: "32px",
      }}
    >
      {label}
    </Button>
  );
}
