import { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";
import { SmmApi } from "../SmmApi";
import GenericTable from "../components/Common/GenericTable";
import SearchBar from "../components/Common/SearchBar";
import PaginationBar from "../components/Common/PaginationBar";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentPaste as DetailsIcon,
  EmojiEvents as RankingIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import MyButton from "../components/FormElements/MyButton";
import { Stack, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AlertBox from "../components/Common/AlertBox.jsx";

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
  const [errorOnLoading, setErrorOnLoading] = useState(false);
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

  let typeAlertLoading = errorOnLoading ? "error" : "success";
  let messageOnLoading = errorOnLoading
    ? "Data upload failed. Please try again!"
    : "";

  const handleDetailsClick = (id) => {
    console.log(data[id])
    navigate(`/swim-meet/${data[id].id}/events`, { state: data[id] });
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
      const json = await SmmApi.getSwimMeetList(searchPar, offset, limit);
      if (!ignore) {
        const formattedData = json.results.map((item) => ({
          ...item,
          date: dayjs(item.date).format("MM/DD/YYYY"),
          time: item.time.slice(0, 5),
        }));
          setData(formattedData);
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
  }, [searchPar, offset, limit]);

  const handleAddNew = () => {
    navigate("/add-swim-meet");
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
            <SearchBar setSearchPar={setSearchPar}></SearchBar>
          </Box>
        </Stack>
        <GenericTable data={data} columns={columns} actions={actions} />
        <PaginationBar
          count={count}
          setOffset={setOffset}
          setLimit={setLimit}
        ></PaginationBar>
      </div>
    );
  }
};

export default SwimMeetDisplay;
