import {
    Add as AddIcon,
    ContentPaste as DetailsIcon,
    Edit as EditIcon,
  } from "@mui/icons-material";
  import { Box, Stack } from "@mui/material";
  import dayjs from "dayjs";
  import { useEffect, useState } from "react";
  import { SmmApi } from "../SmmApi";
  import AlertBox from "../components/Common/AlertBox.jsx";
  import GenericTable from "../components/Common/GenericTable";
  import PaginationBar from "../components/Common/PaginationBar";
  import SearchBar from "../components/Common/SearchBar";
  import MyButton from "../components/FormElements/MyButton";
  
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
    //Controls the data
    const [athleteData, setAthleteData] = useState([]);
    //Use to control the search parameter
    const [searchPar, setSearchPar] = useState("");
    //Variables needed for the pagination bar
    const [count, setCount] = useState(0);
    const [offset, setOffset] = useState(0); //search bar needs to restart this
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0); //search bar needs to restart this
  
    const handleDetailsClick = (id) => {
      console.log("details")
    };
  
    const handleEditClick = () => {
      console.log("Edit ...");
    };
  
  
  
    const actions = [
      {
        name: "Details",
        icon: <DetailsIcon />,
        onClick: handleDetailsClick,
        tip: "More details",
      },
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
          console.log(json.results);
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
  
    const handleAddNew = () => {
      console.log("ADD")
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
          <AlertBox type={"error"} message={"Data upload failed. Please try again!"} />
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
              <MyButton label={"Athlete"} onClick={handleAddNew}>
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
        </div>
      );
    }
  };
  
  export default AthleteDisplay;