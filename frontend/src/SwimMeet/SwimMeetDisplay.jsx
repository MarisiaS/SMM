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

  const handleDetailsClick = (id) => {
    console.log("Details ...", id);
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
      console.log(json);
      if (!ignore) {
        const formattedData = json.results.map((item) => ({
          ...item,
          date: dayjs(item.date).format("MM/DD/YYYY"),
          time: item.time.slice(0, 5),
        }));

        setData(formattedData);
        setCount(json.count);
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

  return (
    <div>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
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
        setLimit={setLimit}
        page={page}
        setPage={setPage}
      ></PaginationBar>
    </div>
  );
};

export default SwimMeetDisplay;
