import { useState } from "react";
import TabPanel from "../components/Common/TabPanel";
import SwimMeetDisplay from "../SwimMeet/SwimMeetDisplay";
import AddSwimMeet from "../SwimMeet/AddSwimMeet";

const TestTabs = () => {
  const [tabs, setTabs] = useState([
    { label: "Heats", content: <SwimMeetDisplay /> },
  ]);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleAddTab = () => {
    setSelectedTab(tabs.length);
    setTabs((prevTabs) => [
      ...prevTabs,
      {
        label: `New Tab ${prevTabs.length + 1}`,
        content: <div>New Content {prevTabs.length + 1}</div>,
      },
    ]);
  };

  return (
    <div className={"test"}>
      <button onClick={handleAddTab} style={{ marginBottom: "10px" }}>
        Add Tab
      </button>
      <TabPanel
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </div>
  );
};

export default TestTabs;
