import {
  ContentPaste as BackIcon,
  Build as BuildIcon,
  Checklist as ChecklistIcon,
  Edit as EditIcon,
  KeyboardDoubleArrowLeft as LeftAllIcon,
  NavigateBefore as LeftIcon,
  KeyboardDoubleArrowRight as RightAllIcon,
  NavigateNext as RightIcon,
  Timer as TimeIcon,
} from "@mui/icons-material";
import {
  CircularProgress,
  Box,
  Dialog,
  DialogContent,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "../App.css";
import { SmmApi } from "../SmmApi.jsx";
import AlertBox from "../components/Common/AlertBox.jsx";
import GenericTable from "../components/Common/GenericTable.jsx";
import ItemPaginationBar from "../components/Common/ItemPaginationBar.jsx";
import SelectTable from "../components/Common/SelectTable.jsx";
import MyIconButton from "../components/FormElements/MyIconButton.jsx";
import { formatTime } from "../utils/helperFunctions.js";
import UpdateSeedTime from "./UpdateSeedTime.jsx";

// Constants for table columns
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
    Cell: ({ cell }) => formatTime(cell.getValue()),
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
    Cell: ({ cell }) => formatTime(cell.getValue()),
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
    Cell: ({ cell }) => formatTime(cell.getValue()),
  },
];

const GenerateHeats = ({ eventName, eventId, onBack, onProcessCompletion }) => {
  //States to manage table data
  const [availableAthletes, setAvailableAthletes] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [selectedRightAthletes, setSelectedRightAthletes] = useState({});
  const [selectedLeftAthletes, setSelectedLeftAthletes] = useState({});
  //State to manage loading
  const [loading, setLoading] = useState(false);
  const [errorOnLoading, setErrorOnLoading] = useState(false);
  //State to manage search on selectTables
  const [availableSearchTerm, setAvailableSearchTerm] = useState("");
  const [selectedSearchTerm, setSelectedSearchTerm] = useState("");
  //State to manage change to step 2 of process
  const [areAthletesSelected, setAreAthletesSelected] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [athleteToUpdate, setAthleteToUpdate] = useState({});
  //State to manage Heat Creation (step 3 of process)
  const [heatsCreated, setHeatsCreated] = useState(false);
  const [errorCreateHeat, setErrorCreateHeat] = useState(false);

  const label = "Event " + eventName;

  // AlertBox variables
  let typeAlertCreateHeats = errorCreateHeat ? "error" : "success";
  let messageCreateHeats = errorCreateHeat
    ? errorCreateHeat
    : "Heats created successfully!";

  useEffect(() => {
    let ignore = false;
    async function fetching() {
      setLoading(true);
      setErrorOnLoading(false);
      try {
        const athletes_json = await SmmApi.getSeedTimes(eventId);
        if (!ignore) {
          setAvailableAthletes(athletes_json);
        }
      } catch (error) {
        setErrorOnLoading(true);
      } finally {
        setLoading(false);
      }
    }
    fetching();
    return () => {
      ignore = true;
    };
  }, []);

  //Event Handlers
  const handleCurrentStep = () => {
    setAreAthletesSelected(!areAthletesSelected);
  };

  const handleGenerateHeats = async (selectedAthletes) => {
    setErrorCreateHeat(false);
    let heatCreationSuccessful = false;
    try {
      const response = await SmmApi.createHeats(eventId, {
        athletes: selectedAthletes,
      });
      heatCreationSuccessful = true;
    } catch (error) {
      setErrorCreateHeat(
        "Unable to Create Heats, an unexpected error occurred. Please try again!"
      );
    }
    setHeatsCreated(true);
    setTimeout(() => {
      if (heatCreationSuccessful) {
        //This will reload the events data and switch to show the details of the given event
        onProcessCompletion(eventId);
      }
      setHeatsCreated(false);
    }, 2000);
  };

  const handleEditClick = (row) => {
    setAthleteToUpdate(row);
    setIsFormOpen(true);
  };

  const handleUpdateSeedTime = async (updatedAthlete) => {
    setSelectedAthletes((prevAthletes) =>
      prevAthletes.map((athlete) =>
        athlete.id === updatedAthlete.id ? updatedAthlete : athlete
      )
    );
    // Delay closing the form
    setTimeout(() => {
      setIsFormOpen(false);
    }, 1500);
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
      label: "Create Heats",
      icon: <BuildIcon />,
      onClick: () => handleGenerateHeats(selectedAthletes),
      visible: areAthletesSelected,
    },
    {
      label: areAthletesSelected
        ? "Back To Select Athletes"
        : "Confirm Seed Times",
      icon: areAthletesSelected ? <ChecklistIcon /> : <TimeIcon />,
      onClick: handleCurrentStep,
      disabled: !areAthletesSelected ? selectedAthletes.length === 0 : false,
    },
    {
      label: "Back to Events",
      icon: <BackIcon />,
      onClick: onBack,
    },
  ];

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

  const renderContent = () => {
    if (loading) {
      return (
        <Stack
          alignItems="center"
          justifyContent="center"
          style={{ height: "100px" }}
        >
          <CircularProgress />
        </Stack>
      );
    }

    if (errorOnLoading) {
      return (
        <Stack
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "300px",
            margin: "auto",
          }}
        >
          <AlertBox
            type="error"
            message="We were unable to load the required data. Please try again."
          />
        </Stack>
      );
    }

    if (!areAthletesSelected) {
      return (
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
                labels={["Athletes Available", "Athlete"]}
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
                labels={["Athletes Selected", "Athlete"]}
              />
            </Box>
          </Box>
        </>
      );
    }
    return (
      <>
        <div>
          <GenericTable
            data={selectedAthletes}
            columns={confirmSeedTimeColumns}
            actions={actions}
          />
          <Dialog open={isFormOpen} fullWidth>
            <UpdateSeedTime
              eventId={eventId}
              athlete={selectedAthletes[athleteToUpdate]}
              onUpdate={handleUpdateSeedTime}
              onCancel={() => setIsFormOpen(false)}
            />
          </Dialog>
          <Dialog open={heatsCreated} fullWidth>
            <DialogContent style={{ padding: "24px" }}>
              <AlertBox
                type={typeAlertCreateHeats}
                message={messageCreateHeats}
              />
            </DialogContent>
          </Dialog>
        </div>
      </>
    );
  };

  return (
    <div>
      <ItemPaginationBar
        label={label}
        extraActions={extraButtons}
        enableNavigationButtons={false}
      ></ItemPaginationBar>
      {renderContent()}
    </div>
  );
};

export default GenerateHeats;
