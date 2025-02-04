import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentPaste as DetailsIcon,
  Edit as EditIcon,
  EmojiEvents as RankingIcon,
} from "@mui/icons-material";
import { CircularProgress, Box, Stack, Dialog } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SmmApi } from "../SmmApi";
import AlertBox from "../components/Common/AlertBox.jsx";
import GenericTable from "../components/Common/GenericTable";
import PaginationBar from "../components/Common/PaginationBar";
import SearchBar from "../components/Common/SearchBar";
import MyButton from "../components/FormElements/MyButton";
import AthleteIcon from "../MyIcons/AthleteIcon.jsx";
import AddSwimMeet from "./AddSwimMeet.jsx";

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    size: 150,
  },
  {
    accessorKey: "date",
    header: "Date",
    size: 150,
  },
  {
    accessorKey: "time",
    header: "Time",
    size: 150,
  },
  {
    accessorKey: "site_name",
    header: "Site",
    size: 150,
  },
];

const SwimMeetDisplay = () => {
  const [loading, setLoading] = useState(false);
  const [errorOnLoading, setErrorOnLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();
  //Controls the data
  const [data, setData] = useState([]);
  //Use to control the search parameter
  const [searchPar, setSearchPar] = useState("");
  //Variables needed for the pagination bar
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0); //search bar needs to restart this
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0); //search bar needs to restart this

  const handleEnrollmentClick = (id) => {
    console.log("Go to Enrollment")
  };

  const handleDetailsClick = (id) => {
    navigate(`/swim-meets/${data[id].id}/events`, {
      state: { meetData: data[id] },
    });
  };

  const handleEditClick = () => {
    console.log("Edit ...");
  };

  const handleDeleteClick = () => {
    console.log("Delete ...");
  };

  const handleRankingClick = () => {
    console.log("Ranking ...");
  };

  const actions = [
    {
      name: "Athlete enrollment",
      icon: <AthleteIcon />,
      onClick: handleEnrollmentClick,
      tip: "Go to Enrollment",
    },
    {
      name: "Details",
      icon: <DetailsIcon />,
      onClick: handleDetailsClick,
      tip: "Go to events",
    },
    {
      name: "Edit",
      icon: <EditIcon />,
      onClick: handleEditClick,
      tip: "Edit basic information",
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
      setLoading(true);
      setErrorOnLoading(false);
      try {
        const json = await SmmApi.getSwimMeetList(searchPar, offset, limit);
        if (!ignore) {
          const formattedData = json.results.map((item) => ({
            ...item,
            date: dayjs(item.date).format("MM/DD/YYYY"),
            time: item.time.slice(0, 5),
          }));
          setData(formattedData);
          setCount(json.count);
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
  }, [searchPar, offset, limit]);

  const handleAddNew = () => {
    setIsFormOpen(true);
  };

  const handleCancelAddSwimMeet = () => {
    setIsFormOpen(false);
  };

  const handleReload = () => {
    navigate(0);
  };

  let actionButtonsErrorOnLoading = [
    { label: "Reload", onClick: handleReload },
  ];

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
            width: "550px",
            margin: "auto",
          }}
        >
          <AlertBox
            type="error"
            message="We were unable to load the required data. Please try again."
            actionButtons={actionButtonsErrorOnLoading}
          />
        </Stack>
      );
    }
    return (
      <div>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box sx={{ marginLeft: 5 }}>
            <MyButton label={"Swim Meet"} onClick={handleAddNew}>
              <AddIcon />
            </MyButton>
          </Box>
          <Box className={"searchBox"} sx={{ marginRight: 5 }}>
            <SearchBar
              setSearchPar={setSearchPar}
              setOffset={setOffset}
              setPage={setPage}
            ></SearchBar>
          </Box>
        </Stack>
        <GenericTable data={data} columns={columns} actions={actions} />
        <PaginationBar
          count={count}
          setOffset={setOffset}
          limit={limit}
          setLimit={setLimit}
          page={page}
          setPage={setPage}
        ></PaginationBar>
        <Dialog open={isFormOpen} fullWidth>
          <AddSwimMeet
          onCancel={handleCancelAddSwimMeet}
          />
        </Dialog>
      </div>
    );
  };

  return <div>{renderContent()}</div>;
};

export default SwimMeetDisplay;
