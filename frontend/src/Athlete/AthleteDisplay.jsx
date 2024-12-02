import {
  Add as AddIcon,
  ContentPaste as DetailsIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { Box, Stack, Dialog } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState, useRef } from "react";
import { SmmApi } from "../SmmApi";
import AlertBox from "../components/Common/AlertBox.jsx";
import GenericTable from "../components/Common/GenericTable";
import PaginationBar from "../components/Common/PaginationBar";
import SearchBar from "../components/Common/SearchBar";
import MyButton from "../components/FormElements/MyButton";
import AddAthlete from "./AddAthlete.jsx";

const columns = [
  {
    accessorKey: "full_name",
    header: "Name",
    size: 150,
  },
  {
    accessorKey: "age",
    header: "Age",
    size: 150,
  },
  {
    accessorKey: "notes",
    header: "Notes",
    size: 350,
  },
];

const AthleteDisplay = () => {
  const [errorOnLoading, setErrorOnLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  //Controls the data
  const [athleteData, setAthleteData] = useState([]);
  const lastCreatedAthleteId = useRef(null);
  const numAthletesCreated = useRef(0);
  //Use to control the search parameter
  const [searchPar, setSearchPar] = useState("");
  //Variables needed for the pagination bar
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0); //search bar needs to restart this
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0); //search bar needs to restart this

  const handleCancelAddAthlete = () => {
    if (numAthletesCreated.current > 0) {
      refreshDataForLastCreatedAthlete();
    }
    setIsFormOpen(false);
  };

  const refreshDataForLastCreatedAthlete = async () => {
    try {
      console.log("Refreshing data...");
      console.log("Last created ID:", lastCreatedAthleteId.current);
      console.log("Number of athletes created:", numAthletesCreated.current);
      const json = await SmmApi.getAthleteList(
        "",
        0,
        count + numAthletesCreated.current
      );
      const indexAthlete = json.results.findIndex(
        (item) => item.id === lastCreatedAthleteId.current
      );
      console.log(indexAthlete);
      if (indexAthlete !== -1) {
        const newPage = Math.floor(indexAthlete / limit);
        setOffset(newPage * limit);
        setCount(json.count);
        setPage(newPage);
      }
    } catch (error) {
      setErrorOnLoading(true);
    }
    numAthletesCreated.current = 0;
    lastCreatedAthleteId.current = null;
  };

  const handleDetailsClick = (id) => {
    console.log("details");
  };

  const handleEditClick = () => {
    console.log("Edit ...");
  };

  const actions = [
    {
      name: "Edit",
      icon: <EditIcon />,
      onClick: handleEditClick,
      tip: "Edit basic information",
    },
  ];

  useEffect(() => {
    let ignore = false;
    async function fetching() {
      try {
        const json = await SmmApi.getAthleteList(searchPar, offset, limit);
        if (!ignore) {
          const formattedData = json.results.map((item) => ({
            ...item,
            date_of_birth: dayjs(item.date_of_birth).format("MM/DD/YYYY"),
          }));
          setAthleteData(formattedData);
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
          type={"error"}
          message={"Data upload failed. Please try again!"}
        />
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
            <MyButton label={"Athlete"} onClick={() => setIsFormOpen(true)}>
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
        <GenericTable data={athleteData} columns={columns} actions={actions} />
        <PaginationBar
          count={count}
          setOffset={setOffset}
          limit={limit}
          setLimit={setLimit}
          page={page}
          setPage={setPage}
        ></PaginationBar>
        <Dialog open={isFormOpen} fullWidth>
          <AddAthlete
            onCancel={handleCancelAddAthlete}
            setLastAthleteCreated={(id) => (lastCreatedAthleteId.current = id)}
            setNumNewAthletes={(num) => (numAthletesCreated.current += num)}
          />
        </Dialog>
      </div>
    );
  }
};

export default AthleteDisplay;
