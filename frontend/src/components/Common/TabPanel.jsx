import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

export default function TabPanel({ tabs, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  const onTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={onTabChange}
          aria-label="tabs"
          variant="fullWidth"
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ p: 2 }}>{tabs[activeTab]?.content}</Box>
    </Box>
  );
}
