import {
    ContentPaste as BackIcon,
    Build as BuildIcon,
    Download as DownloadIcon,
  } from "@mui/icons-material";
  import { CircularProgress, Stack } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import { SmmApi } from "../SmmApi.jsx";
  import AlertBox from "../components/Common/AlertBox.jsx";
  import ItemPaginationBar from "../components/Common/ItemPaginationBar";
  import TabPanel from "../components/Common/TabPanel";
  import DetailsByLane from "../Heat/DetailsByLane.jsx";
  import DetailsByHeat from "../Heat/DetailsByHeat.jsx";
  
  const EventResults = ({
    eventName,
    eventId,
    onBack,
    onPrevious,
    onNext,
    disablePrevious,
    disableNext,
  }) => {
    const label = "Event " + eventName;
  
    return (
      <div>
        <ItemPaginationBar
          label={label}
          onPrevious={onPrevious}
          onNext={onNext}
          disablePrevious={disablePrevious}
          disableNext={disableNext}
        ></ItemPaginationBar>
      </div>
    );
  };
  
  export default EventResults;
  