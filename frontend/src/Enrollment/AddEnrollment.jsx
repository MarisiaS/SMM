import {
  ContentPaste as BackIcon,
  Build as BuildIcon,
  KeyboardDoubleArrowLeft as LeftAllIcon,
  NavigateBefore as LeftIcon,
  KeyboardDoubleArrowRight as RightAllIcon,
  NavigateNext as RightIcon,
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
import SelectTable from "../components/Common/SelectTable.jsx";
import MyIconButton from "../components/FormElements/MyIconButton.jsx";
import ItemPaginationBar from "../components/Common/ItemPaginationBar.jsx";

// Constants for table columns
const availableColumns = [
  {
    accessorKey: "full_name",
    header: "Available Athletes",
    size: 150,
  },
];

const selectedColumns = [
  {
    accessorKey: "full_name",
    header: "Athletes to Enroll",
    size: 150,
  },
];

const AddEnrollment = ({ meetId, onBack, setChangeEnrollment }) => {
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
  //State to manage Enrollment Creation
  const [enrollmentCreated, setEnrollmentCreated] = useState(false);
  const [errorCreateEnrollment, setErrorCreateEnrollment] = useState(false);

  // AlertBox variables
  let typeAlertCreateEnrollment =
    errorCreateEnrollment ===
    "Unable to complete the enrollment, an unexpected error occurred. Please try again!"
      ? "error"
      : "success";

  useEffect(() => {
    let ignore = false;
    async function fetching() {
      setLoading(true);
      setErrorOnLoading(false);
      try {
        const athletes_json = await SmmApi.getUnenrolledAthletes(meetId);
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

  const handleAddEnrollment = async (selectedAthletes) => {
    setErrorCreateEnrollment("");
    let enrollmentCreationSuccessful = false;
    try {
      const athleteIds = selectedAthletes.map((athlete) => athlete.id);
      const response = await SmmApi.createEnrollment(meetId, {
        athlete_ids: athleteIds,
      });
      const num_added= athleteIds.length;
      const athleteNoun = num_added === 1 ? "athlete": "athletes";
      setErrorCreateEnrollment(
        `Successfully enrolled ${num_added} ${athleteNoun} in the swim meet.`
      );
      enrollmentCreationSuccessful = true;
      setChangeEnrollment(true);
    } catch (error) {
      setErrorCreateEnrollment(
        "Unable to complete the enrollment, an unexpected error occurred. Please try again!"
      );
    }
    setEnrollmentCreated(true);
    setTimeout(() => {
      if (enrollmentCreationSuccessful) {
        onBack();
      }
      setEnrollmentCreated(false);
    }, 2000);
  };

  const extraButtons = [
    {
      label: "Confirm Enrollment",
      icon: <BuildIcon />,
      onClick: () => handleAddEnrollment(selectedAthletes),
      disabled: selectedAthletes.length === 0,
    },
    {
      label: "Back to Enrollment",
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
        a.full_name.localeCompare(b.full_name)
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
      return allAthletes.sort((a, b) => a.full_name.localeCompare(b.full_name));
    });
    setAvailableAthletes([]);
    setSelectedLeftAthletes({});
    setSelectedRightAthletes({});
  };

  const onLeftAll = () => {
    handleClearSearch();
    setAvailableAthletes((prevAvailableAthletes) => {
      const allAthletes = [...prevAvailableAthletes, ...selectedAthletes];
      return allAthletes.sort((a, b) => a.full_name.localeCompare(b.full_name));
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
        a.full_name.localeCompare(b.full_name)
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
              labels={["Athletes to Enroll", "Athlete"]}
            />
          </Box>
        </Box>
        <Dialog open={enrollmentCreated} fullWidth>
          <DialogContent style={{ padding: "24px" }}>
            <AlertBox
              type={typeAlertCreateEnrollment}
              message={errorCreateEnrollment}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  };

  return (
    <div>
      <ItemPaginationBar
        label={""}
        extraActions={extraButtons}
        enableNavigationButtons={false}
      ></ItemPaginationBar>
      {renderContent()}
      <div style={{ minHeight: "50px" }}></div>
    </div>
  );
};

export default AddEnrollment;
