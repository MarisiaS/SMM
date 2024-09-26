import { useState, useEffect } from "react";
import { SmmApi } from "../SmmApi.jsx";
import GenericTable from "../components/Common/GenericTable.jsx";
import PaginationBar from "../components/Common/PaginationBar.jsx";
import Title from "../components/Common/Title.jsx";
import AlertBox from "../components/Common/AlertBox.jsx";
import EventDetails from "./EventDetails.jsx";
import {
  FormatAlignCenter as HeatIcon,
  Delete as DeleteIcon,
  EmojiEvents as RankingIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import MyButton from "../components/FormElements/MyButton.jsx";
import { Stack, Box } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const columns = [
  {
    accessorKey: "name",
    header: "Event",
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
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);

  //Pagination States
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  let typeAlertLoading = errorOnLoading ? "error" : "success";
  let messageOnLoading = errorOnLoading
    ? "Data upload failed. Please try again!"
    : "";

  const handleDetailsClick = (id) => {
    setSelectedEventId(eventData[id].id); // Set the selected eventId
    setSelectedEventIndex(Number(id));
    setShowEventDetails(true); // Show the HeatDisplay
  };

  const handleDeleteClick = (id) => {
    console.log("Delete ...");
  };

  const handleRankingClick = (id) => {
    console.log("Ranking ...");
  };

  const actions = [
    {
      name: "Heats",
      icon: <HeatIcon />,
      onClick: handleDetailsClick,
      tip: "Go to heats",
    },
    {
      name: "Delete",
      icon: <DeleteIcon />,
      onClick: handleDeleteClick,
      tip: "Delete",
    },
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
        }
      } catch (error) {
        setErrorOnLoading(true);
      }
    }
    fetching();
    return () => {
      ignore = true;
    };
  }, [offset, limit]);

  const handleAddNew = () => {
    navigate(`/add-event/${meetId}`, { state: meetData });
  };

  const handleBackToEvents = () => {
    console.log(limit);
    setShowEventDetails(false);
    setSelectedEventId(null);
    setSelectedEventIndex(null);
  };

  const handlePreviousEvent = () => {
    console.log(selectedEventIndex);
    console.log(page);
    if (selectedEventIndex > 0) {
      // Previous event on the same page
      setSelectedEventId(eventData[selectedEventIndex - 1].id);
      setSelectedEventIndex(selectedEventIndex - 1);
    } else if (page > 0) {
      // Move to the previous page
      const prevPage = page - 1;
      setPage(prevPage);
      setOffset(prevPage * limit);
      setSelectedEventIndex(limit - 1); // Set to the last event of the previous page once fetched
    }
  };

  // Handle next event (could involve changing pages)
  const handleNextEvent = () => {
    if (selectedEventIndex < eventData.length - 1) {
      // Next event on the same page
      setSelectedEventId(eventData[selectedEventIndex + 1].id);
      setSelectedEventIndex(selectedEventIndex + 1);
    } else if (offset + limit < count) {
      // Move to the next page if available
      const nextPage = page + 1;
      setPage(nextPage);
      setOffset(nextPage * limit);
      setSelectedEventIndex(0); // Set to the first event of the next page once fetched
    }
  };

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
        {(showEventDetails && selectedEventId && eventData[selectedEventIndex]) ? (
          <EventDetails
            eventName={eventData[selectedEventIndex].name}
            eventId={selectedEventId}
            onBack={handleBackToEvents}
            onPrevious={handlePreviousEvent}
            onNext={handleNextEvent}
            disablePrevious={isFirstEvent}
            disableNext={isLastEvent}
          />
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
            <br></br>
            <GenericTable
              data={eventData}
              columns={columns}
              actions={actions}
              notRecordsMessage={"This swim meet does not have events yet"}
            />
            <PaginationBar
              count={count}
              setOffset={setOffset}
              limit = {limit}
              setLimit={setLimit}
              page={page}
              setPage={setPage}
            ></PaginationBar>
          </>
        )}
      </div>
    );
  }
};

export default MeetEventDisplay;
