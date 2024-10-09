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

export default ItemPaginationBar;
