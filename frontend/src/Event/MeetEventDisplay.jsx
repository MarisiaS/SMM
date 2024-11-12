import { useState, useEffect } from "react";
import { SmmApi } from "../SmmApi.jsx";
import GenericTable from "../components/Common/GenericTable.jsx";
import PaginationBar from "../components/Common/PaginationBar.jsx";
import Title from "../components/Common/Title.jsx";
import AlertBox from "../components/Common/AlertBox.jsx";
import EventDetails from "./EventDetails.jsx";
import SelectAthlete from "../GenerateHeats/SelectAthlete.jsx";
import {
  FormatAlignCenter as HeatIcon,
  Delete as DeleteIcon,
  EmojiEvents as RankingIcon,
  Add as AddIcon,
  Build as BuildIcon,
  Download as DownloadIcon,
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
    setShowGenerateHeats(true);
    setShowEventDetails(false);
  };

  const handleDetailsClick = (id) => {
    setSelectedEventIndex(Number(id));
    setShowEventDetails(true);
    setShowGenerateHeats(false);
  };

  const handleDeleteClick = (id) => {
    console.log("Delete ...");
  };

  const handleRankingClick = (id) => {
    console.log("Ranking ...");
  };
  const handleDownloadDetails = async (id) => {
    setSelectedEventIndex(Number(id));
    try {
      await SmmApi.downloadHeatDetails(
        meetData.name,
        eventData[selectedEventIndex].name,
        eventData[selectedEventIndex].id
      );
      console.log("Download initiated.");
    } catch (error) {
      console.error("Download failed:", error);
      alert("There was an error downloading the file. Please try again.");
    }
  };

  const actions = [
    {
      name: "Generate Heats",
      icon: <BuildIcon />,
      onClick: handleGenerateClick,
      tip: "Generate heats",
      visible: (row) => row.original.total_num_heats === 0,
    },
    {
      name: "Heats Details",
      icon: <HeatIcon />,
      onClick: handleDetailsClick,
      tip: "Go to heats",
      visible: (row) => row.original.total_num_heats > 0,
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
    {
      name: "Download Heats Details",
      icon: <DownloadIcon />,
      onClick: handleDownloadDetails,
      tip: "Download Heats Details",
      visible: (row) => row.original.total_num_heats > 0,
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
  }, [offset, limit]);

  const handleAddNew = () => {
    navigate(`/add-event/${meetId}`, { state: meetData });
  };

  const handleBackToEvents = () => {
    setShowEventDetails(false);
    setShowGenerateHeats(false);
    setSelectedEventIndex(null);
  };

  const handleGenerateButton = () => {
    setShowEventDetails(false);
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
            onDownload={handleDownloadDetails}
            disablePrevious={isFirstEvent}
            disableNext={isLastEvent}
          />
        ) : showGenerateHeats && eventData[selectedEventIndex] ? (
          //Need to change to select athletes
          <SelectAthlete
            eventName={eventData[selectedEventIndex].name}
            eventId={eventData[selectedEventIndex].id}
            onBack={handleBackToEvents}
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
