import { useState, useEffect } from "react";
import { SmmApi } from "../SmmApi.jsx";
import GenericTable from "../components/Common/GenericTable.jsx";
import PaginationBar from "../components/Common/PaginationBar.jsx";
import Title from "../components/Common/Title.jsx";
import AlertBox from "../components/Common/AlertBox.jsx";
import {
  ContentPaste as DetailsIcon,
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
  //Variables needed for the pagination bar
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  let typeAlertLoading = errorOnLoading ? "error" : "success";
  let messageOnLoading = errorOnLoading
    ? "Data upload failed. Please try again!"
    : "";

  const handleDetailsClick = (id) => {
    console.log("Heats ...");
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
      icon: <DetailsIcon />,
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
          setLimit={setLimit}
          page={page}
          setPage={setPage}
        ></PaginationBar>
      </div>
    );
  }
};

export default MeetEventDisplay;
