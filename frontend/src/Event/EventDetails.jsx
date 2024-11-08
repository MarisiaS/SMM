import React, { useState, useEffect } from "react";
import { SmmApi } from "../SmmApi.jsx";
import ItemPaginationBar from "../components/Common/ItemPaginationBar";
import TabPanel from "../components/Common/TabPanel";
import ExpandableTable from "../components/Common/ExpandableTable";
import { ContentPaste as BackIcon } from "@mui/icons-material";
import AlertBox from "../components/Common/AlertBox.jsx";
import { Build as BuildIcon } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { formatSeedTime } from "../utils/helperFunctions.js";

const EventDetails = ({
  eventName,
  eventId,
  onBack,
  onPrevious,
  onNext,
  onGenerate,
  disablePrevious,
  disableNext,
}) => {
  const [numHeats, setNumHeats] = useState(null);
  const [heatData, setHeatData] = useState([]);
  const [laneData, setLaneData] = useState([]);
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
      }
    }
    fetching();
    return () => {
      ignore = true;
    };
  }, [eventId]);

  //What is needed for the itemPaginationBar
  const label = "Event " + eventName;
  const extraButtons = [
    {
      label: "Back to events",
      icon: <BackIcon />,
      onClick: onBack,
    },
  ];

  //Need data for heat/lane tables
  const mainHeatTableColumns = [
    {
      accessorKey: "heat_name",
      header: "",
      size: 200,
      Cell: ({ cell }) => <strong>{cell.getValue()}</strong>,
    },
  ];

  const mainLaneTableColumns = [
    {
      accessorKey: "lane_name",
      header: "",
      size: 200,
      Cell: ({ cell }) => <strong>{cell.getValue()}</strong>,
    },
  ];

  const subHeatTableColumns = [
    {
      accessorKey: "lane_num",
      header: "Lane",
      size: 50,
    },
    {
      accessorKey: "athlete_full_name",
      header: "Athlete",
      size: 150,
    },
    {
      accessorKey: "seed_time",
      header: "Seed Time",
      size: 100,
      Cell: ({ cell }) => formatSeedTime(cell.getValue()),
    },
    {
      accessorKey: "heat_time",
      header: "Heat Time",
      size: 100,
      Cell: ({ cell }) => formatSeedTime(cell.getValue()),
    },
  ];

  const subLaneTableColumns = [
    {
      accessorKey: "num_heat",
      header: "Heat",
      size: 50,
    },
    {
      accessorKey: "athlete_full_name",
      header: "Athlete",
      size: 150,
    },
  ];

  //Need for tabs component
  const tabs = [
    {
      label: "By Heat",
      content: (
        <ExpandableTable
          key={"heats" + eventId}
          data={heatData}
          columns={mainHeatTableColumns}
          subTableColumns={subHeatTableColumns}
          subData={"lanes"}
        />
      ),
    },
    {
      label: "By Lane",
      content: (
        <ExpandableTable
          key={"lanes" + eventId}
          data={laneData}
          columns={mainLaneTableColumns}
          subTableColumns={subLaneTableColumns}
          subData={"heats"}
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
      {errorOnLoading ? (
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
