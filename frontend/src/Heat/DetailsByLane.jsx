import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { SmmApi } from "../SmmApi.jsx";
import AlertBox from "../components/Common/AlertBox.jsx";
import ExpandableTable from "../components/Common/ExpandableTable.jsx";
import { formatSeedTime } from "../utils/helperFunctions.js";
import HeatTimeForm from "./HeatTimeForm.jsx";

const DetailsByLane = ({ numLanes, laneData, onLaneDataUpdate }) => {
  const [editMainTableRowIndexes, setEditMainTableRowIndexes] = useState([]);
  const [error, setError] = useState(null);
  const laneFormHooks = Array.from({ length: numLanes }).map(() =>
    useForm({ mode: "onChange" })
  );

  const laneNotEmpty = useMemo(() => {
    return laneData.map((lane) =>
      lane.heats.some((heat) => heat.athlete_full_name !== null)
    );
  }, [laneData]);

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
    setEditMainTableRowIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes, Number(rowIndex)];
      return newIndexes;
    });
  };

  const handleEditClickOnSubTable = (row) => {
    console.log("Heat to update", row);
  };

  const handleSave = (rowIndex) => {
    const laneFormState = laneFormHooks[rowIndex];
    if (laneFormState) {
      laneFormState.handleSubmit(async (data) => {
        const payload = Object.entries(data).map(([heatId, heatTime]) => ({
          heat_id: Number(heatId),
          heat_time:
            heatTime === "DQ" || heatTime === "NS"
              ? heatTime
              : `00:${heatTime}`,
        }));

        try {
          await SmmApi.registerHeatTimes(payload);
          onLaneDataUpdate();
          laneFormState.reset();
          setEditMainTableRowIndexes((prevIndexes) =>
            prevIndexes.filter((index) => index !== Number(rowIndex))
          );
        } catch (error) {
          setError("Failed to update heat times. Please try again.");
        }
      })();
    } else {
      setError("Failed to update heat times. Please try again.");
    }
  };

  const handleCloseClick = (rowIndex) => {
    setEditMainTableRowIndexes((prevIndexes) =>
      prevIndexes.filter((index) => index !== Number(rowIndex))
    );
  };

  const handleDialogClose = () => {
    setError(null);
  };
  const actionsLaneMainTable = [
    {
      name: "Edit",
      icon: <EditIcon />,
      onClick: handleEditClickOnMainTable,
      tip: "Add/Edit heat time",
      visible: (row) => {
        const isEditing = editMainTableRowIndexes.includes(row.index);
        const isLaneAlreadyUpdated = alreadyLaneUpdated(row.index);
        const isLaneEmpty = laneNotEmpty[row.index];
        return !isEditing && !isLaneAlreadyUpdated && isLaneEmpty;
      },
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

  const actionsLaneSubTable = [
    {
      name: "Edit",
      icon: <EditIcon />,
      onClick: handleEditClickOnSubTable,
      tip: "Edit heat time",
      visible: (row) => !!row.original.heat_time,
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
        subTableActions={actionsLaneSubTable}
      />

      <Dialog open={!!error} onClose={handleDialogClose}>
        <DialogContent>
          <AlertBox type="error" message={error} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DetailsByLane;
