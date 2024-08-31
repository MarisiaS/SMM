import { useState, useEffect } from "react";
import { SmmApi } from "../SmmApi";
import GenericTable from "../components/Common/GenericTable";
import {
  ContentPaste as DetailsIcon,
  EmojiEvents as RankingIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import MyButton from "../components/FormElements/MyButton";
import { Stack, Box } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Title from "../components/Common/Title";

const columns = [
  {
    accessorKey: "name",
    header: "Event",
    size: 150,
  },
];

const MeetEventDisplay = () => {
  const { meetId } = useParams();
  const [eventData, setEventData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const meetData = location.state;

  const handleDetailsClick = (id) => {
    console.log("Details ...", id);
  };

  const handleRankingClick = () => {
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
      name: "Ranking",
      icon: <RankingIcon />,
      onClick: handleRankingClick,
      tip: "Go to ranking",
    },
  ];

  useEffect(() => {
    let ignore = false;
    async function fetching() {
      const meetEvents = await SmmApi.getSwimMeetEvents(meetId);
      console.log(meetEvents);
      if (!ignore) {
        setEventData(meetEvents);
      }
    }
    fetching();
    return () => {
      ignore = true;
    };
  }, []);

  const handleAddNew = () => {
    console.log("Add new event");
    navigate("/add-event");
  };

  return (
    <div>
      <Title data={meetData} fields={["name", "date", "site_name"]} />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
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
    </div>
  );
};

export default MeetEventDisplay;
