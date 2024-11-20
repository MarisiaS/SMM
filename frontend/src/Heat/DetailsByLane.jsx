import {
  Edit as EditIcon,
  Close as CloseIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import React, { useState } from "react";
import { SmmApi } from "../SmmApi.jsx";
import ExpandableTable from "../components/Common/ExpandableTable.jsx";
import HeatTimeForm from "./HeatTimeForm.jsx";
import { formatSeedTime } from "../utils/helperFunctions.js";
import { useForm } from "react-hook-form";

const DetailsByLane = ({ numLanes, laneData }) => {
  const [editMainTableRowIndexes, setEditMainTableRowIndexes] = useState([]);
  const laneFormHooks = Array.from({ length: numLanes }).map(() =>
    useForm({ mode: "onChange" })
  );

  //Need data for lane tables
  const mainLaneTableColumns = [
    {
      accessorKey: "lane_name",
      header: "",
      size: 200,
      Cell: ({ cell }) => <strong>{cell.getValue()}</strong>,
    },
  ];

  const getSubLaneTableColumns = (rowIndex) => {
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
          <HeatTimeForm
            key={row.original.id}
            control={laneFormHooks[rowIndex]?.control}
            name={String(row.original.id)}
          />
        ) : (
          <br />
        ),
    };
    return editMainTableRowIndexes.includes(rowIndex)
      ? [baseColumns[0], baseColumns[1], editHeatTimeColumn]
      : [baseColumns[0], baseColumns[1], heatTimeColumn];
  };

  const alreadyLaneUpdated = (rowIndex) => {
    return laneData[rowIndex].heats.some((heat) => heat.heat_time !== null);
  };

  const handleEditClickOnMainTable = (rowIndex) => {
    console.log(editMainTableRowIndexes);
    console.log("Row index:", rowIndex);
    console.log("Data on that row:", laneData[rowIndex]);
    setEditMainTableRowIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes, Number(rowIndex)];
      return newIndexes;
    });
  };

  const handleSave = (rowIndex) => {
    console.log("Save pressed.");
    const laneFormState = laneFormHooks[rowIndex];
    if (laneFormState) {
      laneFormState.handleSubmit((data) => {
        // TODO (Issue #150): Implement API call to persist the data
        // Currently, 'data' is an object containing key-value pairs
        // where each key represents a heat ID and the corresponding value
        // is the entered heat time for that specific heat.
        console.log("Submitting data for row:", rowIndex, "with values:", data);
        laneFormState.reset();
        setEditMainTableRowIndexes((prevIndexes) =>
          prevIndexes.filter((index) => index !== Number(rowIndex))
        );
      })();
    } else {
      console.log("No useForm");
    }
  };

  const handleCloseClick = (rowIndex) => {
    setEditMainTableRowIndexes((prevIndexes) =>
      prevIndexes.filter((index) => index !== Number(rowIndex))
    );
  };

  const actionsLaneMainTable = [
    {
      name: "Edit",
      icon: <EditIcon />,
      onClick: handleEditClickOnMainTable,
      tip: "Add/Edit heat time",
      visible: (row) =>
        !(
          editMainTableRowIndexes.includes(row.index) ||
          alreadyLaneUpdated(row.index)
        ),
    },
    {
      name: "Save",
      icon: <SaveIcon />,
      onClick: handleSave,
      tip: "Save results",
      visible: (row) => editMainTableRowIndexes.includes(row.index),
    },
    {
      name: "Close",
      icon: <CloseIcon />,
      onClick: handleCloseClick,
      tip: "Close edit mode",
      visible: (row) => editMainTableRowIndexes.includes(row.index),
    },
  ];

  return (
    <div>
      <ExpandableTable
        data={laneData}
        columns={mainLaneTableColumns}
        actions={actionsLaneMainTable}
        getSubTableColumns={getSubLaneTableColumns}
        subData={"heats"}
      />
    </div>
  );
};

export default DetailsByLane;
