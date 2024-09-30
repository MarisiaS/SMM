import * as React from "react";
import { Tabs, Tab, Box, useTheme } from "@mui/material";

export default function TabPanel({
  tabs,
  selectedTab,
  setSelectedTab,
  defaultTab = 0,
}) {
  // const [activeTab, setActiveTab] = React.useState(defaultTab);
  const theme = useTheme();

  const onTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{
          borderLeft: 2,
          borderRight: 2,
          borderTop: 2,
          borderBottom: 2,
          borderColor: theme.palette.primary.main,
          borderTopLeftRadius: "6px",
          borderTopRightRadius: "6px",
        }}>
        <Tabs
          value={selectedTab}
          onChange={onTabChange}
          aria-label="tabs"
          variant="fullWidth"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              sx={{
                color: theme.palette.primary.main,
                fontWeight: "bold", // Set default text color
                "&.Mui-selected": {
                  color: theme.palette.primary.contrastText, // Set text color when selected
                  backgroundColor: theme.palette.primary.main,
                  fontWeight: "bold",
                },
              }}
            />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ p: 0 }}>{tabs[selectedTab]?.content}</Box>
    </Box>
  );
}
