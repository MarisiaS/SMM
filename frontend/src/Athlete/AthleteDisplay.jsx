import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { CircularProgress, Box, Stack, Dialog } from "@mui/material";
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
    accessorKey: "gender_display",
    header: "Gender",
    size: 150,
  },
  {
    accessorKey: "age",
    header: "Age",
    size: 150,
  },
];

const AthleteDisplay = () => {
  const [loading, setLoading] = useState(false);
  const [errorOnLoading, setErrorOnLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  //Controls the data
  const [athleteData, setAthleteData] = useState([]);
  const [athleteToEditId, setAthleteToEditId] = useState(null);
  const lastCreatedAthleteId = useRef(null);
  const numAthletesCreated = useRef(0);
  const [renderTrigger, setRenderTrigger] = useState(0);
  //Use to control the search parameter
  const [searchPar, setSearchPar] = useState("");
  const searchBarRef = useRef(null);
  //Variables needed for the pagination bar
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0); //search bar needs to restart this
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0); //search bar needs to restart this

  const handleAddClick = () => {
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch();
    }
    setSearchPar("");
    setIsFormOpen(true);
  };

  const handleCancelAddAthlete = () => {
    if (lastCreatedAthleteId.current) {
      refreshDataForLastCreatedAthlete();
    }
    setAthleteToEditId(null);
    setIsFormOpen(false);
  };

  const refreshDataForLastCreatedAthlete = async () => {
    try {
      const json = await SmmApi.getAthleteList(
        "",
        0,
        count + numAthletesCreated.current
      );
      const indexAthlete = json.results.findIndex(
        (item) => item.id === lastCreatedAthleteId.current
      );
      if (indexAthlete !== -1) {
        const newPage = Math.floor(indexAthlete / limit);
        if (offset != newPage * limit) {
          setOffset(newPage * limit);
        } else {
          setRenderTrigger((prev) => prev + 1);
        }
        setCount(json.count);
        setPage(newPage);
      }
    } catch (error) {
      setErrorOnLoading(true);
    }
    numAthletesCreated.current = 0;
    lastCreatedAthleteId.current = null;
  };

  const handleEditClick = (row) => {
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch();
    }
    setSearchPar("");
    setAthleteToEditId(athleteData[row].id);
    setIsFormOpen(true);
  };

  const actions = [
    {
      name: "Edit",
      icon: <EditIcon />,
      onClick: handleEditClick,
      tip: "Edit Athlete",
    },
  ];

  useEffect(() => {
    let ignore = false;
    async function fetching() {
      setLoading(true);
      setErrorOnLoading(false);
      try {
        const json = await SmmApi.getAthleteList(searchPar, offset, limit);
        if (!ignore) {
          const formattedData = json.results.map((item) => ({
            ...item,
            date_of_birth: dayjs(item.date_of_birth).format("MM/DD/YYYY"),
          }));
          setAthleteData(formattedData);
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
  }, [searchPar, offset, limit, renderTrigger]);

  const handleReload = () => {
    setRenderTrigger((prev) => prev + 1);
  };

  let actionButtonsErrorOnLoading = [
    { label: "Reload", onClick: handleReload },
  ];

  let messageNoRecords =
    searchPar === ""
      ? "No athletes have been added yet"
      : "No athletes match your search";

  const renderContent = () => {
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
      <>
        <div>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box sx={{ marginLeft: 5 }}>
              <MyButton label={"Athlete"} onClick={handleAddClick}>
                <AddIcon />
              </MyButton>
            </Box>
            <Box className={"searchBox"} sx={{ marginRight: 5 }}>
              <SearchBar
                ref={searchBarRef}
                setSearchPar={setSearchPar}
                setOffset={setOffset}
                setPage={setPage}
              ></SearchBar>
            </Box>
          </Stack>
          {loading && (
            <Stack
              alignItems="center"
              justifyContent="center"
              style={{ height: "100px" }}
            >
              <CircularProgress />
            </Stack>
          )}
          {!loading && (
            <>
              <GenericTable
                data={athleteData}
                columns={columns}
                actions={actions}
                notRecordsMessage={messageNoRecords}
              />
              <PaginationBar
                count={count}
                setOffset={setOffset}
                limit={limit}
                setLimit={setLimit}
                page={page}
                setPage={setPage}
              ></PaginationBar>
            </>
          )}
          <Dialog open={isFormOpen} fullWidth>
            <AddAthlete
              onCancel={handleCancelAddAthlete}
              setLastAthleteCreated={(id) =>
                (lastCreatedAthleteId.current = id)
              }
              setNumNewAthletes={(num) => (numAthletesCreated.current += num)}
              athleteToEditId={athleteToEditId}
            />
          </Dialog>
        </div>
      </>
    );
  };

  return <div>{renderContent()}</div>;
};

export default AthleteDisplay;
