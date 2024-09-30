import React, { useState, useEffect } from "react";
import { SmmApi } from "../SmmApi.jsx";
import ItemPaginationBar from "../components/Common/ItemPaginationBar";
import TabPanel from "../components/Common/TabPanel";
import ExpandableTable from "../components/Common/ExpandableTable";
import { useTheme } from "@mui/material";
import { ContentPaste as BackIcon } from "@mui/icons-material";

const formatSeedTime = (seedTime) => {

  if (!seedTime) return null;
  if (seedTime === "NT") return "NT";
  const timeParts = seedTime.split(":");
  const secondsAndMillis = parseFloat(timeParts[2]).toFixed(2);
  if (timeParts[0] !== "00") {
    return `${timeParts[0]}:${timeParts[1]}:${secondsAndMillis}`;
  }
  if (timeParts[1] !== "00") {
    const minutes = parseInt(timeParts[1], 10);
    return `${minutes}:${secondsAndMillis}`;
  }
  return `${secondsAndMillis}`;
};

const EventDetails = ({
  eventName,
  eventId,
  onBack,
  onPrevious,
  onNext,
  disablePrevious,
  disableNext,
}) => {
  const [numHeats, setNumHeats] = useState(null);
  const [heatData, setHeatData] = useState([]);
  const [laneData, setLaneData] = useState([]);
  const [errorOnLoading, setErrorOnLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0); // Manage selected tab
  const theme = useTheme();

  useEffect(() => {
    setSelectedTab(0); // Reset to the first tab whenever the eventId changes
  }, [eventId]);

  //Use efects to fetch the data whe SmmApi ready
  useEffect(() => {
    let ignore = false;
    async function fetching() {
      try {
        const heat_json = await SmmApi.getEventHeats(eventId);
        console.log(heat_json);
        if (!ignore) {
          console.log(heat_json.data.results);
          setHeatData(heat_json.data.results);
          setNumHeats(heat_json.data.count);
        }
        const lane_json = await SmmApi.getEventLanes(eventId);
        if (!ignore) {
          setLaneData(lane_json.data.results);
          setErrorOnLoading(false);
        }
        console.log(heatData);
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
      Cell: ({ cell }) => <strong>{cell.getValue()}</strong>
    },
  ];

  const mainLaneTableColumns = [
    {
      accessorKey: "lane_name",
      header: "",
      size: 200,
      Cell: ({ cell }) => <strong>{cell.getValue()}</strong>
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
      {/*If count for numHeat is 0 alert box with message no heat and generate heat button
         Else tabpanel with heats/lane*/}
      {numHeats ? (
        <TabPanel
          tabs={tabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab} // Handle tab change
        />
      ) : null}
    </div>
  );
};

export default EventDetails;
