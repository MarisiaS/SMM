import React, { useState } from "react";
import MyIconButton from "../FormElements/MyIconButton";
import MyButton from "../FormElements/MyButton";
import { Stack, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
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
  disableNav = false,
}) => {
  return (
    <div>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box className={"labelBox"} sx={{ marginLeft: 5 }}>
          <h2>{label}</h2>
        </Box>
        <Box sx={{ marginLeft: 5, visibility: disableNav ? 'hidden' : 'visible' }}>
          <MyIconButton onClick={onPrevious} disabled={disablePrevious}>
            <PreviousIcon />
          </MyIconButton>
        </Box>
        <Box sx={{ marginRight: 5, visibility: disableNav ? 'hidden' : 'visible' }}>
          <MyIconButton onClick={onNext} disabled={disableNext}>
            <NextIcon />
          </MyIconButton>
        </Box>
        {extraActions &&
          extraActions.map((action, index) => (
            <Box key={index}>
              <MyButton label={action.label} onClick={action.onClick} disabled = {action.disabled}>
                {action.icon}
              </MyButton>
            </Box>
          ))}
      </Stack>
    </div>
  );
};

export default ItemPaginationBar;
