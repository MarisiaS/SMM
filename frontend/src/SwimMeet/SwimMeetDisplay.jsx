import { useMemo, useState, useEffect } from "react";
import { SmmApi } from "../SmmApi";
import GenericTable from "../components/Common/GenericTable";
import SearchBar from "../components/Common/SearchBar";
import PaginationBar from "../components/Common/PaginationBar";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentPasteSearch as DetailsIcon,
  EmojiEvents as RankingIcon,
  Add as AddIcon
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
  const [data, setData] = useState([]);
  const [searchPar, setSearchPar] = useState("");
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);

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
    { name: "Details", icon: <DetailsIcon />, onClick: handleDetailsClick },
    { name: "Edit", icon: <EditIcon />, onClick: handleEditClick },
    { name: "Delete", icon: <DeleteIcon />, onClick: handleDeleteClick },
    { name: "Ranking", icon: <RankingIcon />, onClick: handleRankingClick },
  ];

  useEffect(() => {
    let ignore = false;
    async function fetching() {
      const json = await SmmApi.getSwimMeetList(searchPar, offset, limit);
      console.log(json);
      if (!ignore) {
        setData(json.results);
        setCount(json.count);
      }
    }
    fetching();
    return () => {
      ignore = true;
    };
  }, [searchPar, offset, limit]);

  const handleAddNew = () => {
    console.log("Add new...");
    navigate("/NavBar");
  };

  return (
    <div>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box sx={{ marginLeft: 5 }}>
          <MyButton label={"Swim Meet"} onClick={handleAddNew}>
            <AddIcon/>
          </MyButton>
        </Box>
        <Box className={"searchBox"} sx={{ marginRight: 5 }}>
          <SearchBar setSearchPar={setSearchPar}></SearchBar>
        </Box>
      </Stack>
      <GenericTable data={data} columns={columns} actions={actions} />
      <PaginationBar count={count} setOffset={setOffset} setLimit={setLimit}></PaginationBar>
    </div>
  );
};

export default SwimMeetDisplay;