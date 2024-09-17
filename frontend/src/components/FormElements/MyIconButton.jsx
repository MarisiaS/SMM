import * as React from "react";
import { Button, useTheme } from "@mui/material";

export default function MyIconButton(props) {
  const { onClick, disabled } = props;
  const theme = useTheme();
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
        minWidth: "32px",
      }}
    >
      {props.children}
    </Button>
  );
}
