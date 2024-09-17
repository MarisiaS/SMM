import { useState } from "react";
import { MoveUp as BackIcon, Add as AddIcon } from "@mui/icons-material";
import TabPanel from "../src/components/Common/TabPanel";
import SwimMeetDisplay from "../src/SwimMeet/SwimMeetDisplay";
import AddSwimMeet from "../src/SwimMeet/AddSwimMeet";

const TestTabs = () => {
  const handleByHeatsClick = () => {
    console.log("Heats");
  };

  const handleByLanesClick = () => {
    console.log("Lanes");
  };

  const tabs = [
    {
      label: "Heats",
      onClick: handleByHeatsClick,
      content: <SwimMeetDisplay />,
    },
    {
      label: "Lanes",
      onClick: handleByLanesClick,
      content: <AddSwimMeet />,
    },
  ];

  return (
    <div className={"test"}>
      <TabPanel tabs={tabs} />
    </div>
  );
};

export default TestTabs;
