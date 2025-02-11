import {
  Add as AddIcon,
  PersonRemove as UnenrollIcon,
} from "@mui/icons-material";
import GenericTable from "../components/Common/GenericTable";
import SearchBar from "../components/Common/SearchBar";
import MyButton from "../components/FormElements/MyButton";
import Title from "../components/Common/Title";
import { CircularProgress, Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const testData = [
  {
    id: 2,
    athlete_full_name: "Ana Gomez",
    gender: "Girl",
    age: "12",
  },
  {
    id: 10,
    athlete_full_name: "Anna Anderson",
    gender: "Girl",
    age: "12",
  },
  {
    id: 16,
    athlete_full_name: "Ava Wilson",
    gender: "Girl",
    age: "12",
  },
  {
    id: 4,
    athlete_full_name: "Elena Lopez",
    gender: "Girl",
    age: "12",
  },
  {
    id: 12,
    athlete_full_name: "Ellie Yuan",
    gender: "Girl",
    age: "12",
  },
  {
    id: 8,
    athlete_full_name: "Kyla Smith",
    gender: "Girl",
    age: "12",
  },
  {
    id: 6,
    athlete_full_name: "Laura Sanchez",
    gender: "Girl",
    age: "12",
  },
  {
    id: 15,
    athlete_full_name: "Olivia Davis",
    gender: "Girl",
    age: "12",
  },
  {
    id: 11,
    athlete_full_name: "Sofia Avila",
    gender: "Girl",
    age: "12",
  },
];

const columns = [
  {
    accessorKey: "athlete_full_name",
    header: "Athlete Name",
    size: 150,
  },
  {
    accessorKey: "gender",
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
  // View states
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

  const actions = [
    {
      name: "Unenroll",
      icon: <UnenrollIcon />,
      onClick: handleUnEnrollmentClick,
      tip: "Unenroll Athlete",
    },
  ];

  const renderContent = () => {
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
            <GenericTable data={testData} columns={columns} actions={actions} />
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
