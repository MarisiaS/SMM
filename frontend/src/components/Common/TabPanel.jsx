import * as React from "react";
import { Tabs, Tab, Box, useTheme, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function TabPanel({ tabs, selectedTab, setSelectedTab, onRemoveTab }) {
  const theme = useTheme();

  const onTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderLeft: 2,
          borderRight: 2,
          borderTop: 2,
          borderBottom: 2,
          borderColor: theme.palette.primary.main,
          borderTopLeftRadius: "6px",
          borderTopRightRadius: "6px",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={onTabChange}
          aria-label="tabs"
          variant="fullWidth"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              component="div"
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>{tab.label}</span>
                  {tab.close && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTab(index);
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              }
              sx={{
                color: theme.palette.primary.main,
                fontWeight: "bold",
                borderRight:
                  index !== tabs.length - 1
                    ? `2.5px solid ${theme.palette.primary.main}`
                    : "none",
                "&.Mui-selected": {
                  color: theme.palette.primary.contrastText,
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
