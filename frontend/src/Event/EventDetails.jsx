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

const EventDetails = ({
  eventName,
  eventId,
  numLanes,
  onBack,
  onPrevious,
  onNext,
  onGenerate,
  onDownload,
  disablePrevious,
  disableNext,
}) => {
  const [numHeats, setNumHeats] = useState(null);
  const [heatData, setHeatData] = useState([]);
  const [laneData, setLaneData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorOnLoading, setErrorOnLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [reloadDetailsTrigger, setReloadDetailsTrigger] = useState(0);

  //Use efects to fetch the data whe SmmApi ready
  useEffect(() => {
    let ignore = false;
    async function fetching() {
      setLoading(true);
      try {
        const heat_json = await SmmApi.getEventHeats(eventId);
        const lane_json = await SmmApi.getEventLanes(eventId);
        if (!ignore) {
          setLaneData(lane_json.results);
          setHeatData(heat_json.results);
          setNumHeats(heat_json.count);
          setErrorOnLoading(false);
        }
      } catch (error) {
        setErrorOnLoading(true);
      } finally {
        setLoading(false);
      }
    }
    fetching();
    return () => {
      ignore = true;
    };
  }, [eventId, reloadDetailsTrigger]);

  const handleLaneDataUpdate = () => {
    setReloadDetailsTrigger((prev) => prev + 1);
  };

  //What is needed for the itemPaginationBar
  const label = "Event " + eventName;
  const extraButtons = [
    {
      label: "Back to events",
      icon: <BackIcon />,
      onClick: onBack,
    },
    {
      label: "Download Details",
      icon: <DownloadIcon />,
      onClick: onDownload,
      disabled: numHeats === 0,
    },
  ];

  //Need for tabs component
  const tabs = [
    {
      label: "By Heat",
      content: <DetailsByHeat key={"heats" + eventId} heatData={heatData} />,
    },
    {
      label: "By Lane",
      content: (
        <DetailsByLane
          key={"lanes" + eventId}
          numLanes={numLanes}
          laneData={laneData}
          onLaneDataUpdate={handleLaneDataUpdate}
        />
      ),
    },
  ];

  //Need for Generate heats AlertBox

  let actionButtonsNoHeats = [
    { label: "Create Heats", onClick: onGenerate, icon: <BuildIcon /> },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <Stack
          alignItems="center"
          justifyContent="center"
          style={{ height: "100px" }}
        >
          <CircularProgress />
        </Stack>
      );
    }
    if (errorOnLoading) {
      return (
        <Stack
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "300px",
            margin: "auto",
          }}
        >
          <AlertBox
            type="error"
            message="We were unable to load the required data. Please try again."
          />
        </Stack>
      );
    }
    if (numHeats > 0) {
      return (
        <TabPanel
          tabs={tabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      );
    }
    if (numHeats === 0) {
      <>
        <Stack
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "500px",
            margin: "auto",
          }}
        >
          <AlertBox
            type="info"
            message="This event has no heats yet."
            actionButtons={actionButtonsNoHeats}
          />
        </Stack>
      </>;
    }
    return null;
  };

  return (
    <div>
      <ItemPaginationBar
        label={label}
        onPrevious={onPrevious}
        onNext={onNext}
        disablePrevious={disablePrevious}
        disableNext={disableNext}
        extraActions={extraButtons}
      ></ItemPaginationBar>
      {renderContent()}
    </div>
  );
};

export default EventDetails;
