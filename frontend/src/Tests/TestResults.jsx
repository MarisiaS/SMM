import "../App.css";
import { useState } from "react";
import GenericTable from "../components/Common/GenericTable";
import { Box } from "@mui/material";

const testData = [
  {
    id: 2,
    rank: 1,
    athlete_full_name: "Ana Gomez",
    heat_time: "37.81",
  },
  {
    id: 10,
    rank: 2,
    athlete_full_name: "Anna Anderson",
    heat_time: "38.54",
  },
  {
    id: 16,
    rank: 3,
    athlete_full_name: "Ava Wilson",
    heat_time: "39.81",
  },
  {
    id: 4,
    rank: 3,
    athlete_full_name: "Elena Lopez",
    heat_time: "40.22",
  },
  {
    id: 12,
    rank: 5,
    athlete_full_name: "Ellie Yuan",
    heat_time: "41.84",
  },
  {
    id: 8,
    rank: 6,
    athlete_full_name: "Kyla Smith",
    heat_time: "42.55",
  },
  {
    id: 6,
    rank: null,
    athlete_full_name: "Laura Sanchez",
    heat_time: "NS",
  },
  {
    id: 15,
    rank: null,
    athlete_full_name: "Olivia Davis",
    heat_time: "DQ",
  },
  {
    id: 11,
    rank: null,
    athlete_full_name: "Sofia Avila",
    heat_time: "DQ",
  },
];

const columns = [
  {
    accessorKey: "rank",
    header: "Rank",
    size: 100,
  },
  {
    accessorKey: "athlete_full_name",
    header: "Athlete",
    size: 250,
  },
  {
    accessorKey: "heat_time",
    header: "Heat time",
    size: 150,
  },
];

const rowHighlight = (row) => {
  const rank = row.original.rank;
  if (rank === 1) {
    return {
      backgroundColor: "#ffd700",
      "& *": {
        color: "#264040",
        fontWeight: "bold",
      },
    };
  }
  if (rank === 2) {
    return {
      backgroundColor: "#c0c0c0",
      "& *": {
        color: "#264040",
        fontWeight: "bold",
      },
    };
  }
  if (rank === 3) {
    return {
      backgroundColor: "#DAAA5E",
      "& *": {
        color: "#264040",
        fontWeight: "bold",
      },
    };
  }
  if (rank === null) {
    return {
        backgroundColor: "#f0f0f0",
      "& *": {
        color: "#a0a0a0",
        fontStyle: "italic",
        fontWeight: "lighter"
      },
    };
  }
  return {};
};

const TestResults = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={"test"}
      >
        <GenericTable
          data={testData}
          columns={columns}
          enableSearch={true}
          getRowStyle={rowHighlight}
        />
      </Box>
    </div>
  );
};

export default TestResults;
