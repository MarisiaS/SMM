import {
  ContentPaste as BackIcon,
  Build as BuildIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { CircularProgress, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SmmApi } from "../SmmApi.jsx";
import AlertBox from "../components/Common/AlertBox.jsx";
import ExpandableTable from "../components/Common/ExpandableTable";
import ItemPaginationBar from "../components/Common/ItemPaginationBar";
import TabPanel from "../components/Common/TabPanel";
import { formatSeedTime } from "../utils/helperFunctions.js";

const EventDetails = ({
  eventName,
  eventId,
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
  const [editMainTableRowIds, setEditMainTableRowIds] = useState([]);

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
        console.log(lane_json.data.results);
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

  const getSubHeatTableColumns = (rowId) => [
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

  const getSubLaneTableColumns = (rowId) => {
    const baseColumns = [
      { accessorKey: "num_heat", header: "Heat", size: 50 },
      { accessorKey: "athlete_full_name", header: "Athlete", size: 150 },
    ];
    const heatTimeColumn = {
      accessorKey: "heat_time",
      header: "Heat Time",
      size: 100,
      Cell: ({ cell }) => formatSeedTime(cell.getValue()),
    };
    const editHeatTimeColumn = {
      accessorKey: "heat_time",
      header: "Heat Time",
      id: "edit_heat_time",
      size: 250,
      Cell: ({ row }) =>
        row.original.athlete_full_name ? (
          row.original.heat_time ? (
            <AlertBox
              key={row.original.id}
              type={"success"}
              message={"Editing heat time"}
            />
          ) : (
            <AlertBox
              key={row.original.id}
              type={"error"}
              message={"No heat time"}
            />
          )
        ) : (
          <br />
        ),
    };
    return editMainTableRowIds.includes(rowId)
      ? [baseColumns[0], baseColumns[1], editHeatTimeColumn]
      : [baseColumns[0], baseColumns[1], heatTimeColumn];
  };

  const alreadyLaneUpdated = (rowIndex) => {
    return laneData[rowIndex].heats.some((heat) => heat.heat_time !== null);
  };

  const handleEditClickOnMainTable = (rowIndex) => {
    setEditMainTableRowIds((prevIds) => {
      const newIds = [...prevIds, laneData[rowIndex].id];
      return newIds;
    });
  };

  const handleSave = () => {
    console.log("Save pressed.");
  };

  const handleCloseClick = (rowIndex) => {
    setEditMainTableRowIds((prevIds) =>
      prevIds.filter((id) => id !== laneData[rowIndex].id)
    );
  };

  const actionsLaneMainTable = [
    {
      name: "Edit",
      icon: <EditIcon />,
      onClick: handleEditClickOnMainTable,
      tip: "Add/Edit heat time",
      visible: (row) => {
        const rowId = row.original.id;
        const rowIndex = row.index;
        return (
          !(editMainTableRowIds.includes(rowId) || alreadyLaneUpdated(rowIndex))
        );
      },
    },
    {
      name: "Save",
      icon: <SaveIcon />,
      onClick: handleSave,
      tip: "Save results",
      visible: (row) => editMainTableRowIds.includes(row.original.id),
    },
    {
      name: "Close",
      icon: <CloseIcon />,
      onClick: handleCloseClick,
      tip: "Close edit mode",
      visible: (row) => editMainTableRowIds.includes(row.original.id),
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
          getSubTableColumns={getSubHeatTableColumns}
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
          actions={actionsLaneMainTable}
          getSubTableColumns={getSubLaneTableColumns}
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
