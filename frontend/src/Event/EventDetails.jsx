import React, { useState, useEffect } from "react";
import { SmmApi } from "../SmmApi.jsx";
import ItemPaginationBar from "../components/Common/ItemPaginationBar";
import TabPanel from "../components/Common/TabPanel";
import ExpandableTable from "../components/Common/ExpandableTable";
import { useTheme } from "@mui/material";
import { ContentPaste as BackIcon } from "@mui/icons-material";

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
  const theme = useTheme();

  //Use efects to fetch the data whe SmmApi ready
  useEffect(() => {
    let ignore = false;
    async function fetching() {
      try {
        const heat_json = await SmmApi.getEventHeats(eventId);
        console.log(heat_json);
        if (!ignore) {
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
  const label = eventName;
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
      size: 150,
    },
  ];

  const mainLaneTableColumns = [
    {
      accessorKey: "lane_name",
      header: "",
      size: 150,
    },
  ];

  const subHeatTableColumns = [
    {
      accessorKey: "lane_num",
      header: "Lane",
      size: 150,
    },
    {
      accessorKey: "athlete_full_name",
      header: "Athlete",
      size: 150,
    },
    {
      accessorKey: "seed_time",
      header: "Seed Time",
      size: 150,
    },
    {
      accessorKey: "heat_time",
      header: "Heat Time",
      size: 150,
    },
  ];

  const subLaneTableColumns = [
    {
      accessorKey: "num_heat",
      header: "Heat",
      size: 150,
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
          key={"heats"}
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
          key={"lanes"}
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
      {numHeats ? <TabPanel tabs={tabs} /> : null}
    </div>
  );
};

export default EventDetails;
