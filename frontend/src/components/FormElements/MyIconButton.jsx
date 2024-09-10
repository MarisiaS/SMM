import * as React from "react";
import {Button, useTheme} from "@mui/material";

export default function MyIconButton(props) {
  const { onClick, disabled } = props;
  const theme = useTheme();
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      color={theme.secondary}
      sx={{
        minWidth: "32px",
      }}
    >
      {props.children}
    </Button>
  );
}
