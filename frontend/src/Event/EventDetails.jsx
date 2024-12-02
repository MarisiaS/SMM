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

  let typeAlertLoading = errorOnLoading ? "error" : "success";
  let messageOnLoading = errorOnLoading
    ? "Data upload failed. Please try again!"
    : "";

  //Use efects to fetch the data whe SmmApi ready
  useEffect(() => {
    let ignore = false;
    async function fetching() {
      setLoading(true);
      try {
        const heat_json = await SmmApi.getEventHeats(eventId);
        const lane_json = await SmmApi.getEventLanes(eventId);
        if (!ignore) {
          setLaneData(lane_json.data.results);
          setHeatData(heat_json.data.results);
          setNumHeats(heat_json.data.count);
          setErrorOnLoading(false);
        }
      } catch (error) {
        setErrorOnLoading(true);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    }
    fetching();
    return () => {
      ignore = true;
    };
  }, [eventId]);

  const handleLaneDataUpdate = (updatedData) => {
    //Update the data by lane
    const updatedLaneData = laneData.map((lane) => {
      const updatedHeats = lane.heats.map((heat) => {
        const updatedHeat = updatedData.find((p) => p.heat_id === heat.id);
        return updatedHeat
          ? { ...heat, heat_time: updatedHeat.heat_time }
          : heat;
      });
      return { ...lane, heats: updatedHeats };
    });
    setLaneData(updatedLaneData);

    //Update the data by heat
    const updatedHeatData = heatData.map((heat) => {
      const updatedLanes = heat.lanes.map((lane) => {
        const updatedLane = updatedData.find((p) => p.heat_id === lane.id);
        return updatedLane
          ? { ...lane, heat_time: updatedLane.heat_time }
          : lane;
      });
      return { ...heat, lanes: updatedLanes };
    });
    setHeatData(updatedHeatData);
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
      {loading ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          style={{ height: "100px" }}
        >
          <CircularProgress />
        </Stack>
      ) : errorOnLoading ? (
        <>
          <Stack
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "300px",
              margin: "auto",
            }}
          >
            <AlertBox type={typeAlertLoading} message={messageOnLoading} />
          </Stack>
        </>
      ) : numHeats ? (
        <TabPanel
          tabs={tabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      ) : (
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
        </>
      )}
    </div>
  );
};

export default EventDetails;
