import "../App.css";
import { useState } from "react";
import SelectTable from "../components/Common/SelectTable";
import MyIconButton from "../components/FormElements/MyIconButton";
import { Box, Stack } from "@mui/material";
import {
  NavigateBefore as LeftIcon,
  NavigateNext as RightIcon,
  KeyboardDoubleArrowRight as RightAllIcon,
  KeyboardDoubleArrowLeft as LeftAllIcon,
} from "@mui/icons-material";

const testData = [
  {
    id: 2,
    athlete_full_name: "Ana Gomez",
    seed_time: "45.10",
  },
  {
    id: 10,
    athlete_full_name: "Anna Anderson",
    seed_time: "38.54",
  },
  {
    id: 16,
    athlete_full_name: "Ava Wilson",
    seed_time: "37.81",
  },
  {
    id: 4,
    athlete_full_name: "Elena Lopez",
    seed_time: "39.21",
  },
  {
    id: 12,
    athlete_full_name: "Ellie Yuan",
    seed_time: "41.84",
  },
  {
    id: 8,
    athlete_full_name: "Kyla Smith",
    seed_time: "41.54",
  },
  {
    id: 6,
    athlete_full_name: "Laura Sanchez",
    seed_time: "31.36",
  },
  {
    id: 15,
    athlete_full_name: "Olivia Davis",
    seed_time: "38.54",
  },
  {
    id: 11,
    athlete_full_name: "Sofia Avila",
    seed_time: "NT",
  },
];

const availableColumns = [
  {
    accessorKey: "athlete_full_name",
    header: "Available athletes",
    size: 150,
  },
  {
    accessorKey: "seed_time",
    header: "Seed time",
    size: 100,
  },
];

const selectedColumns = [
  {
    accessorKey: "athlete_full_name",
    header: "Selected athletes",
    size: 150,
  },
  {
    accessorKey: "seed_time",
    header: "Seed time",
    size: 100,
  },
];

const TestSelectTable = () => {
  const [availableData, setAvailableData] = useState(testData);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedRightData, setSelectedRightData] = useState({});
  const [selectedLeftData, setSelectedLeftData] = useState({});

  const onRightSelected = () => {
    //Move selected items from left table to right table
    const dataToMove = availableData.filter(
      (item) => item.id in selectedRightData
    );
    setSelectedData((prevSelectedData) => {
      const updatedData = [...prevSelectedData, ...dataToMove];
      return updatedData.sort((a, b) =>
        a.athlete_full_name.localeCompare(b.athlete_full_name)
      );
    });
    // Update available data by filtering out the moved items
    setAvailableData((prevAvailableData) =>
      prevAvailableData.filter(
        (item) => !(item.id in selectedRightData) // Filter out moved items
      )
    );
    // Clear selectedRightData
    setSelectedRightData({});
  };

  const onRightAll = () => {
    // Move all items to the right table
    setAvailableData([]);
    setSelectedData(testData);
    setSelectedLeftData([]);
    setSelectedRightData([]);
  };

  const onLeftAll = () => {
    // Move all items back to the left table
    setAvailableData(testData);
    setSelectedData([]);
    setSelectedLeftData([]);
    setSelectedRightData([]);
  };

  const onLeftSelected = () => {
    // Move selected items back to the left table
    const dataToMove = selectedData.filter(
      (item) => item.id in selectedLeftData
    );
    setAvailableData((prevAvailableData) => {
      const updatedData = [...prevAvailableData, ...dataToMove];
      return updatedData.sort((a, b) =>
        a.athlete_full_name.localeCompare(b.athlete_full_name)
      );
    });
    // Update available data by filtering out the moved items
    setSelectedData((prevSelectedData) =>
      prevSelectedData.filter(
        (item) => !(item.id in selectedLeftData) // Filter out moved items
      )
    );
    // Clear selectedRightData
    setSelectedLeftData({});
  };
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
        sx={{ gap: "15px", width: "80%", height: "auto", margin: "2px" }}
      >
        <Box flex="1" sx={{ maxWidth: "40%", flexGrow: 1 }}>
          <SelectTable
            data={availableData}
            columns={availableColumns}
            selection={selectedRightData}
            rowSelection={selectedRightData}
            setRowSelection={setSelectedRightData}
            notRecordsMessage={"No athletes available."}
          />
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center">
          <MyIconButton
            onClick={onRightSelected}
            disabled={Object.keys(selectedRightData).length === 0}
          >
            <RightIcon />
          </MyIconButton>

          <MyIconButton
            onClick={onRightAll}
            disabled={availableData.length === 0}
          >
            <RightAllIcon />
          </MyIconButton>

          <MyIconButton
            onClick={onLeftAll}
            disabled={availableData.length === testData.length}
          >
            <LeftAllIcon />
          </MyIconButton>

          <MyIconButton
            onClick={onLeftSelected}
            disabled={Object.keys(selectedLeftData).length === 0}
          >
            <LeftIcon />
          </MyIconButton>
        </Box>

        <Box flex="1" sx={{ maxWidth: "40%", flexGrow: 1 }}>
          <SelectTable
            data={selectedData}
            columns={selectedColumns}
            rowSelection={selectedLeftData}
            setRowSelection={setSelectedLeftData}
            notRecordsMessage={"No athletes selected."}
          />
        </Box>
      </Box>
    </div>
  );
};

export default TestSelectTable;
