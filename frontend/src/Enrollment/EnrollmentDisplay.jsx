import {
  Add as AddIcon,
  PersonRemove as UnenrollIcon,
} from "@mui/icons-material";
import { SmmApi } from "../SmmApi";
import AlertBox from "../components/Common/AlertBox.jsx";
import GenericTable from "../components/Common/GenericTable";
import SearchBar from "../components/Common/SearchBar";
import MyButton from "../components/FormElements/MyButton";
import Title from "../components/Common/Title";
import PaginationBar from "../components/Common/PaginationBar.jsx";
import { CircularProgress, Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const columns = [
  {
    accessorKey: "full_name",
    header: "Athlete Name",
    size: 150,
  },
  {
    accessorKey: "gender_display",
    header: "gender",
    size: 150,
  },
  {
    accessorKey: "age",
    header: "Age",
    size: 150,
  },
];

const EnrollmentDisplay = () => {
  const { meetId } = useParams();
  const location = useLocation();
  const meetData = location.state?.meetData;
  //Controls the data
  const [enrollmentData, setEnrollmentData] = useState([]);
  // View states
  const [loading, setLoading] = useState(false);
  const [errorOnLoading, setErrorOnLoading] = useState(false);
  const [view, setView] = useState(null);
  //Use to control the search parameter
  const [searchPar, setSearchPar] = useState("");
  //Variables needed for the pagination bar
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0); //search bar needs to restart this
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0); //search bar needs to restart this

  const handleUnEnrollmentClick = (id) => {
    console.log("Unenroll", id);
  };

  const handleAddEnrollment = () => {
    setView("enroll");
  };

  useEffect(() => {
    let ignore = false;
    async function fetching() {
      setLoading(true);
      setErrorOnLoading(false);
      try {
        //Change to enrollment
        const json = await SmmApi.getAthleteList(searchPar, offset, limit);
        if (!ignore) {
          setEnrollmentData(json.results);
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
  }, []);
  const actions = [
    {
      name: "Unenroll",
      icon: <UnenrollIcon />,
      onClick: handleUnEnrollmentClick,
      tip: "Unenroll Athlete",
    },
  ];

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
          />
        </Stack>
      );
    }
    switch (view) {
      case "enroll":
        return <div> Here goes enrollment</div>;
      default:
        return (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box sx={{ marginLeft: 5 }}>
                <MyButton label={"Enroll"} onClick={handleAddEnrollment}>
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
                  data={enrollmentData}
                  columns={columns}
                  actions={actions}
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
          </>
        );
    }
  };
  return (
    <div>
      <Title data={meetData} fields={["name", "date", "site_name"]} />
      {renderContent()}
    </div>
  );
};

export default EnrollmentDisplay;
