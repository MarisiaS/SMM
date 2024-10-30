import "../App.css";
import React, { useState, useEffect } from "react";
import { SmmApi } from "../SmmApi.jsx";
import SelectTable from "../components/Common/SelectTable";
import MyIconButton from "../components/FormElements/MyIconButton";
import ItemPaginationBar from "../components/Common/ItemPaginationBar.jsx";
import GenericTable from "../components/Common/GenericTable.jsx";
import AlertBox from "../components/Common/AlertBox.jsx";
import { Box, Stack } from "@mui/material";
import { formatSeedTime } from "../utils/helperFunctions.js";
import {
  NavigateBefore as LeftIcon,
  NavigateNext as RightIcon,
  KeyboardDoubleArrowRight as RightAllIcon,
  KeyboardDoubleArrowLeft as LeftAllIcon,
  ContentPaste as BackIcon,
  Timer as TimeIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { Dialog } from "@mui/material";
import UpdateSeedTime from "./UpdateSeedTime.jsx";

const availableColumns = [
  {
    accessorKey: "athlete_full_name",
    header: "Available Athletes",
    size: 150,
  },
  {
    accessorKey: "seed_time",
    header: "Seed Time",
    size: 100,
    Cell: ({ cell }) => formatSeedTime(cell.getValue()),
  },
];

const selectedColumns = [
  {
    accessorKey: "athlete_full_name",
    header: "Selected Athletes",
    size: 150,
  },
  {
    accessorKey: "seed_time",
    header: "Seed Time",
    size: 100,
    Cell: ({ cell }) => formatSeedTime(cell.getValue()),
  },
];

const confirmSeedTimeColumns = [
  {
    accessorKey: "athlete_full_name",
    header: "Athlete",
    size: 150,
  },
  {
    accessorKey: "seed_time",
    header: "Seed Time",
    size: 150,
    Cell: ({ cell }) => formatSeedTime(cell.getValue()),
  },
];

const SelectAthlete = ({ eventName, eventId, onBack }) => {
  const [availableAthletes, setAvailableAthletes] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [selectedRightAthletes, setSelectedRightAthletes] = useState({});
  const [selectedLeftAthletes, setSelectedLeftAthletes] = useState({});
  const [errorOnLoading, setErrorOnLoading] = useState(false);
  const [availableSearchTerm, setAvailableSearchTerm] = useState("");
  const [selectedSearchTerm, setSelectedSearchTerm] = useState("");
  const [areAthletesSelected, setAreAthletesSelected] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [athleteToUpdate, setAthleteToUpdate] = useState({});

  let typeAlertLoading = errorOnLoading ? "error" : "success";
  let messageOnLoading = errorOnLoading
    ? "Data upload failed. Please try again!"
    : "";

  useEffect(() => {
    let ignore = false;
    async function fetching() {
      try {
        const athletes_json = await SmmApi.getSeedTimes(eventId);
        if (!ignore) {
          setAvailableAthletes(athletes_json.data.results);
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
  }, []);

  const handleCurrentStep = () => {
    console.log("Confirm seed time clicked!");
    setAreAthletesSelected(!areAthletesSelected);
  };

  const handleGenerateHeats = () => {
    console.log("Generate Heats clicked!");
  };

  const handleBackToSelectAthletes = () => {
    console.log("Back to Select Athletes!");
    setAreAthletesSelected(false);
  };

  const handleEditClick = (row) => {
    console.log("Edit seed time ...");
    setAthleteToUpdate(row);
    setIsFormOpen(true);
    console.log(row);
    console.log(selectedAthletes[row]);
    console.log(athleteToUpdate);
  };

  const actions = [
    {
      name: "Edit",
      icon: <EditIcon />,
      onClick: handleEditClick,
      tip: "Edit Seed Time",
    },
  ];

  const extraButtons = [
    {
      label: areAthletesSelected ? "Select Athletes" : "Confirm seed times",
      icon: areAthletesSelected ? <EditIcon /> : <TimeIcon />,
      onClick: handleCurrentStep,
      disabled: !areAthletesSelected ? selectedAthletes.length === 0 : false,
    },
    {
      label: "Back to events",
      icon: <BackIcon />,
      onClick: onBack,
    },
    {
      label: "Heats",
      icon: <BackIcon />,
      onClick: onBack,
      visible: areAthletesSelected,
    },
  ];

  const label = "Event " + eventName;

  const handleClearSearch = () => {
    setAvailableSearchTerm("");
    setSelectedSearchTerm("");
  };

  const onRightSelected = () => {
    handleClearSearch();
    const athletesToMove = availableAthletes.filter(
      (item) => item.id in selectedRightAthletes
    );
    setSelectedAthletes((prevSelectedAthletes) => {
      const updatedAthletes = [...prevSelectedAthletes, ...athletesToMove];
      return updatedAthletes.sort((a, b) =>
        a.athlete_full_name.localeCompare(b.athlete_full_name)
      );
    });
    setAvailableAthletes((prevAvailableAthletes) =>
      prevAvailableAthletes.filter(
        (item) => !(item.id in selectedRightAthletes)
      )
    );
    setSelectedRightAthletes({});
  };

  const onRightAll = () => {
    handleClearSearch();
    setSelectedAthletes((prevSelectedAthletes) => {
      const allAthletes = [...prevSelectedAthletes, ...availableAthletes];
      return allAthletes.sort((a, b) =>
        a.athlete_full_name.localeCompare(b.athlete_full_name)
      );
    });
    setAvailableAthletes([]);
    setSelectedLeftAthletes({});
    setSelectedRightAthletes({});
  };

  const onLeftAll = () => {
    handleClearSearch();
    setAvailableAthletes((prevAvailableAthletes) => {
      const allAthletes = [...prevAvailableAthletes, ...selectedAthletes];
      return allAthletes.sort((a, b) =>
        a.athlete_full_name.localeCompare(b.athlete_full_name)
      );
    });
    setSelectedAthletes([]);
    setSelectedLeftAthletes({});
    setSelectedRightAthletes({});
  };

  const onLeftSelected = () => {
    handleClearSearch();
    const athletesToMove = selectedAthletes.filter(
      (item) => item.id in selectedLeftAthletes
    );
    setAvailableAthletes((prevAvailableAthletes) => {
      const updatedAthletes = [...prevAvailableAthletes, ...athletesToMove];
      return updatedAthletes.sort((a, b) =>
        a.athlete_full_name.localeCompare(b.athlete_full_name)
      );
    });
    setSelectedAthletes((prevSelectedAthletes) =>
      prevSelectedAthletes.filter((item) => !(item.id in selectedLeftAthletes))
    );
    setSelectedLeftAthletes({});
  };
  return (
    <div>
      <ItemPaginationBar
        label={label}
        extraActions={extraButtons}
        enableNavigationButtons={false}
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
      ) : !areAthletesSelected ? (
        <>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ gap: "25px", width: "100%", height: "auto", margin: "2px" }}
          >
            <Box flex="1" sx={{ maxWidth: "45%", flexGrow: 1 }}>
              <SelectTable
                data={availableAthletes}
                columns={availableColumns}
                selection={selectedRightAthletes}
                rowSelection={selectedRightAthletes}
                setRowSelection={setSelectedRightAthletes}
                notRecordsMessage={"No athletes available."}
                searchTerm={availableSearchTerm}
                setSearchTerm={setAvailableSearchTerm}
              />
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center">
              <MyIconButton
                onClick={onRightSelected}
                disabled={Object.keys(selectedRightAthletes).length === 0}
              >
                <RightIcon />
              </MyIconButton>

              <MyIconButton
                onClick={onRightAll}
                disabled={availableAthletes.length === 0}
              >
                <RightAllIcon />
              </MyIconButton>

              <MyIconButton
                onClick={onLeftAll}
                disabled={selectedAthletes.length === 0}
              >
                <LeftAllIcon />
              </MyIconButton>

              <MyIconButton
                onClick={onLeftSelected}
                disabled={Object.keys(selectedLeftAthletes).length === 0}
              >
                <LeftIcon />
              </MyIconButton>
            </Box>

            <Box flex="1" sx={{ maxWidth: "45%", flexGrow: 1 }}>
              <SelectTable
                data={selectedAthletes}
                columns={selectedColumns}
                rowSelection={selectedLeftAthletes}
                setRowSelection={setSelectedLeftAthletes}
                notRecordsMessage={"No athletes selected."}
                searchTerm={selectedSearchTerm}
                setSearchTerm={setSelectedSearchTerm}
              />
            </Box>
          </Box>
        </>
      ) : (
        <div>
          <GenericTable
            data={selectedAthletes}
            columns={confirmSeedTimeColumns}
            actions={actions}
          />
          <Dialog
            open={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            fullWidth
          >
            <UpdateSeedTime athlete={selectedAthletes[athleteToUpdate]} />
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default SelectAthlete;
