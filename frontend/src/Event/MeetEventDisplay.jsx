import {
  Add as AddIcon,
  Build as BuildIcon,
  Delete as DeleteIcon,
  FormatAlignCenter as HeatIcon,
  EmojiEvents as RankingIcon,
} from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GenerateHeats from "../GenerateHeats/GenerateHeats.jsx";
import { SmmApi } from "../SmmApi.jsx";
import AlertBox from "../components/Common/AlertBox.jsx";
import GenericTable from "../components/Common/GenericTable.jsx";
import PaginationBar from "../components/Common/PaginationBar.jsx";
import Title from "../components/Common/Title.jsx";
import MyButton from "../components/FormElements/MyButton.jsx";
import EventDetails from "./EventDetails.jsx";
import AddEvent from "./AddEvent.jsx";

const columns = [
  {
    accessorKey: "name",
    header: "Event",
    size: 150,
  },
  {
    accessorKey: "total_num_heats",
    header: " Number of Heats",
    size: 150,
  },
];

const MeetEventDisplay = () => {
  const { meetId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const meetData = location.state;
  const [eventData, setEventData] = useState([]);
  const [errorOnLoading, setErrorOnLoading] = useState(false);

  //EventDetail states
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showGenerateHeats, setShowGenerateHeats] = useState(false);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [navegationDirection, setNavegationDirection] = useState(null);

  //AddNew states
  const [showAddEvent, setShowAddEvent] = useState(false);

  //GenerateHeats states
  const [reloadEventDataTrigger, setReloadEventDataTrigger] = useState(0);

  //Pagination States
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  let typeAlertLoading = errorOnLoading ? "error" : "success";
  let messageOnLoading = errorOnLoading
    ? "Data upload failed. Please try again!"
    : "";

  const handleGenerateClick = (id) => {
    setSelectedEventIndex(Number(id));
    setShowAddEvent(false);
    setShowEventDetails(false);
    setShowGenerateHeats(true);
  };

  const handleDetailsClick = (id) => {
    setSelectedEventIndex(Number(id));
    setShowAddEvent(false);
    setShowGenerateHeats(false);
    setShowEventDetails(true);
  };

  const handleDeleteClick = (id) => {
    console.log("Delete ...");
  };

  const handleRankingClick = (id) => {
    console.log("Ranking ...");
  };

  const actions = [
    {
      name: "Create Heats",
      icon: <BuildIcon />,
      onClick: handleGenerateClick,
      tip: "Go to Create Heats",
      visible: (row) => row.original.total_num_heats === 0,
    },
    {
      name: "Heats Details",
      icon: <HeatIcon />,
      onClick: handleDetailsClick,
      tip: "Go to Heats",
      visible: (row) => row.original.total_num_heats > 0,
    },
    // {
    //   name: "Delete",
    //   icon: <DeleteIcon />,
    //   onClick: handleDeleteClick,
    //   tip: "Delete",
    // },
    {
      name: "Ranking",
      icon: <RankingIcon />,
      onClick: handleRankingClick,
      tip: "Go to ranking",
    },
  ];

  useEffect(() => {
    let ignore = false;
    async function fetching() {
      try {
        const json = await SmmApi.getSwimMeetEvents(meetId, offset, limit);
        if (!ignore) {
          setEventData(json.results);
          setCount(json.count);
          setErrorOnLoading(false);
          if (navegationDirection === "previous") {
            setSelectedEventIndex(limit - 1);
          } else if (navegationDirection === "next") {
            setSelectedEventIndex(0);
          }
          setNavegationDirection(null);
        }
      } catch (error) {
        setErrorOnLoading(true);
      }
    }
    fetching();
    return () => {
      ignore = true;
    };
  }, [offset, limit, reloadEventDataTrigger]);

  const handleAddNew = () => {
    setShowEventDetails(false);
    setShowGenerateHeats(false);
    setSelectedEventIndex(null);
    setShowAddEvent(true);
  };

  const handleBackToEvents = () => {
    setReloadEventDataTrigger((prev) => prev + 1);
    setShowEventDetails(false);
    setShowGenerateHeats(false);
    setShowAddEvent(false);
    setSelectedEventIndex(null);  
  };

  const handleGenerateButton = () => {
    setShowEventDetails(false);
    setShowAddEvent(false);
    setShowGenerateHeats(true);
  };

  const handlePreviousEvent = () => {
    if (selectedEventIndex > 0) {
      // Previous event on the same page
      setSelectedEventIndex(selectedEventIndex - 1);
    } else if (page > 0) {
      // Move to the previous page
      const prevPage = page - 1;
      setNavegationDirection("previous");
      setPage(prevPage);
      setOffset(prevPage * limit);
    }
  };

  // Handle next event (could involve changing pages)
  const handleNextEvent = () => {
    if (selectedEventIndex < eventData.length - 1) {
      // Next event on the same page
      setSelectedEventIndex(selectedEventIndex + 1);
    } else if (offset + limit < count) {
      // Move to the next page if available
      const nextPage = page + 1;
      setNavegationDirection("next");
      setPage(nextPage);
      setOffset(nextPage * limit);
    }
  };

  const handleGenerateHeatProcessCompletion = (eventId) => {
    const index = eventData.findIndex((item) => item.id === eventId);
    setReloadEventDataTrigger((prev) => prev + 1);
    if (index === -1) {
      setShowGenerateHeats(false);
      setShowEventDetails(false);
      setSelectedEventIndex(null);
    } else {
      setShowGenerateHeats(false);
      setSelectedEventIndex(index);
      setShowEventDetails(true);
    }
  };

  // const handleAddHeatsToNewEvent = (eventId) => {
  //   let index = -1;
  //   let currentOffset = 0;
  //   while (index === -1){
  //     setOffset(currentOffset);
  //     const index = eventData.findIndex((item) => item.id === eventId);
  //     if (index != -1){
  //     setSelectedEventIndex(index);
  //     setShowGenerateHeats(true);
  //     setShowEventDetails(false);
  //     break;
  //     }
  //     currentOffset +=limit;
  //   }
  // };

  const isFirstEvent = page === 0 && selectedEventIndex === 0;
  const isLastEvent = offset + selectedEventIndex + 1 >= count;

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
        <AlertBox type={typeAlertLoading} message={messageOnLoading} />
      </Stack>
    );
  } else {
    return (
      <div>
        <Title data={meetData} fields={["name", "date", "site_name"]} />
        {showEventDetails && eventData[selectedEventIndex] ? (
          <EventDetails
            eventName={eventData[selectedEventIndex].name}
            eventId={eventData[selectedEventIndex].id}
            onBack={handleBackToEvents}
            onPrevious={handlePreviousEvent}
            onNext={handleNextEvent}
            onGenerate={handleGenerateButton}
            disablePrevious={isFirstEvent}
            disableNext={isLastEvent}
          />
        ) : showGenerateHeats && eventData[selectedEventIndex] ? (
          <GenerateHeats
            eventName={eventData[selectedEventIndex].name}
            eventId={eventData[selectedEventIndex].id}
            onBack={handleBackToEvents}
            onProcessCompletion={handleGenerateHeatProcessCompletion}
          />
        ) : showAddEvent ? (
          <AddEvent onBack={handleBackToEvents} />
        ) : (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box sx={{ marginLeft: 5 }}>
                <MyButton label={"Event"} onClick={handleAddNew}>
                  <AddIcon />
                </MyButton>
              </Box>
              <Box className={"searchBox"} sx={{ marginRight: 5 }}></Box>
            </Stack>
            <br />
            <GenericTable
              data={eventData}
              columns={columns}
              actions={actions}
              notRecordsMessage={"This swim meet does not have events yet"}
            />
            <PaginationBar
              count={count}
              setOffset={setOffset}
              limit={limit}
              setLimit={setLimit}
              page={page}
              setPage={setPage}
            />
          </>
        )}
      </div>
    );
  }
};

export default MeetEventDisplay;
