import * as React from "react";
import Alert from "@mui/material/Alert";
import MyButton from "../FormElements/MyButton";
import { Box, Stack } from "@mui/material";

export default function AlertBox({ type, message, actionButtons }) {
  return (
    <Box className={"itemBox"}>
      <Alert
        variant="outlined"
        severity={type}
        className={"myForm"}
        style={{ width: "100%", margin: "auto"}}
        action={
          actionButtons && (
            <Stack direction="row" spacing={0.5}>
              {actionButtons.map((button, index) => (
                <MyButton
                  key={index}
                  label={button.label}
                  onClick={button.onClick}
                >
                  {button.icon}
                </MyButton>
              ))}
            </Stack>
          )
        }
      >
        {message}
      </Alert>
    </Box>
  );
}
