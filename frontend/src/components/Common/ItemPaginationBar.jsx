import React, { useState } from "react";
import MyIconButton from "../FormElements/MyIconButton";
import MyButton from "../FormElements/MyButton";
import { Stack, Box, Typography } from "@mui/material";
import {
  NavigateBefore as PreviousIcon,
  NavigateNext as NextIcon,
} from "@mui/icons-material";

const ItemPaginationBar = ({
  label,
  onPrevious,
  onNext,
  disablePrevious,
  disableNext,
  extraActions,
  enableNavigationButtons = true,
}) => {
  return (
    <div>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box className={"labelBox"} sx={{ marginLeft: 5 }}>
          <Typography
            sx={{
              color: "text.secondary",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            {label}
          </Typography>
        </Box>
        <Box
          sx={{
            marginLeft: 5,
            visibility: enableNavigationButtons ? "visible" : "hidden",
          }}
        >
          <MyIconButton onClick={onPrevious} disabled={disablePrevious}>
            <PreviousIcon />
          </MyIconButton>
        </Box>
        <Box
          sx={{
            marginRight: 5,
            visibility: enableNavigationButtons ? "visible" : "hidden",
          }}
        >
          <MyIconButton onClick={onNext} disabled={disableNext}>
            <NextIcon />
          </MyIconButton>
        </Box>
        {extraActions &&
          extraActions.map((action, index) => {
            let shouldRender = true;
            if ("visible" in action) {
              shouldRender = action.visible;
            }
            return (
              shouldRender && (
                <Box key={index}>
                  <MyButton
                    label={action.label}
                    onClick={action.onClick}
                    disabled={action.disabled}
                  >
                    {action.icon}
                  </MyButton>
                </Box>
              )
            );
          })}
      </Stack>
    </div>
  );
};

export default ItemPaginationBar;
