import React, { useState } from "react";
import MyIconButton from "../FormElements/MyIconButton";
import MyButton from "../FormElements/MyButton";
import { Stack, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  NavigateBefore as PreviousIcon,
  NavigateNext as NextIcon,
} from "@mui/icons-material";

const LabelText = styled("h3")({
  whiteSpace: "nowrap",
  overflow: "visible",
  margin: 0,
});

const ItemPagination = ({
  label,
  onPrevious,
  onNext,
  disablePrevious,
  disableNext,
  extraActions,
}) => {
  return (
    <div>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box className={"itemBox"} sx={{ marginLeft: 5 }}>
          <LabelText>{label}</LabelText>
        </Box>
        <Box sx={{ marginLeft: 5 }}>
          <MyIconButton onClick={onPrevious} disabled={disablePrevious}>
            <PreviousIcon />
          </MyIconButton>
        </Box>
        <Box sx={{ marginRight: 5 }}>
          <MyIconButton onClick={onNext} disabled={disableNext}>
            <NextIcon />
          </MyIconButton>
        </Box>
        {extraActions &&
          extraActions.map((action, index) => (
            <Box key={index}>
              <MyButton label={action.label} onClick={action.onClick}>
                {action.icon}
              </MyButton>
            </Box>
          ))}
      </Stack>
    </div>
  );
};

export default ItemPagination;
