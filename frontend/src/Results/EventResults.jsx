import {
  ContentPaste as BackIcon,
  Download as DownloadIcon,
  FormatAlignCenter as HeatIcon,
} from "@mui/icons-material";
import { CircularProgress, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SmmApi } from "../SmmApi.jsx";
import AlertBox from "../components/Common/AlertBox.jsx";
import ItemPaginationBar from "../components/Common/ItemPaginationBar";
import MultiSelectWithTags from "../components/Common/MultiSelectWithTags";
import TabPanel from "../components/Common/TabPanel";
import GenericTable from "../components/Common/GenericTable.jsx";
import { formatTime } from "../utils/helperFunctions.js";

const columns = [
  {
    accessorKey: "rank",
    header: "Rank",
    size: 100,
  },
  {
    accessorKey: "athlete_full_name",
    header: "Athlete",
    size: 250,
  },
  {
    accessorKey: "heat_time",
    header: "Heat Time",
    size: 150,
    Cell: ({ cell }) => formatTime(cell.getValue()),
  },
];

const rowHighlight = (row) => {
  const rank = row.original.rank;
  if (rank === 1) {
    return {
      backgroundColor: "#ffd700",
      "& *": {
        color: "#264040",
        fontWeight: "bold",
      },
    };
  }
  if (rank === 2) {
    return {
      backgroundColor: "#c0c0c0",
      "& *": {
        color: "#264040",
        fontWeight: "bold",
      },
    };
  }
  if (rank === 3) {
    return {
      backgroundColor: "#DAAA5E",
      "& *": {
        color: "#264040",
        fontWeight: "bold",
      },
    };
  }
  if (rank === null) {
    return {
      backgroundColor: "#f0f0f0",
      "& *": {
        color: "#a0a0a0",
        fontStyle: "italic",
        fontWeight: "lighter",
      },
    };
  }
  return {};
};

const EventResults = ({
  swimMeetName,
  eventName,
  eventId,
  groupId,
  onBack,
  onPrevious,
  onNext,
  disablePrevious,
  disableNext,
  onHeats,
}) => {
  const [resultsData, setResultsData] = useState({ main: [] });
  const [hasResults, setHasResults] = useState(null);
  const [groupOptions, setGroupOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorOnLoading, setErrorOnLoading] = useState(false);

  //States MultiSelect
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [lastSelectedGroupId, setLastSelectedGroupId] = useState(null);

  //States TabPanel
  const [tabs, setTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const checkEventHasResults = (data) => {
    if (data.length === 0 || data.some((ele) => ele.heat_time === null)) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    let ignore = false;
    async function fetching() {
      setLoading(true);
      setErrorOnLoading(false);
      setHasResults(null);
      try {
        const [resultsResponse, groupFilterResponse] = await Promise.all([
          SmmApi.getEventResults(eventId),
          SmmApi.getGroups(groupId),
        ]);
        if (!ignore) {
          setResultsData({ main: resultsResponse });
          setHasResults(checkEventHasResults(resultsResponse));
          setSelectedGroups([]);
          setLastSelectedGroupId(null);
          setSelectedTab(0);
          setGroupOptions(groupFilterResponse);
          setTabs([
            {
              key: "main",
              label: "General Results",
              content: (
                <GenericTable
                  key={"results"}
                  data={resultsResponse}
                  columns={columns}
                  enableSearch={true}
                  getRowStyle={rowHighlight}
                />
              ),
            },
          ]);
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
  }, [eventId]);

  useEffect(() => {
    if (lastSelectedGroupId) {
      const selectedGroup = groupOptions.find(
        (group) => group.id === lastSelectedGroupId
      );

      // Check if data for the selected group already exists
      if (resultsData[lastSelectedGroupId]) {
        setSelectedTab(tabs.length);
        setTabs((prevTabs) => [
          ...prevTabs,
          {
            key: lastSelectedGroupId,
            label: selectedGroup.name,
            content: (
              <GenericTable
                key={lastSelectedGroupId}
                data={resultsData[lastSelectedGroupId]}
                columns={columns}
                enableSearch={true}
                getRowStyle={rowHighlight}
              />
            ),
            close: true,
          },
        ]);
      } else {
        const fetchGroupData = async () => {
          setLoading(true);
          try {
            const groupDataResponse = await SmmApi.getEventResults(
              eventId,
              lastSelectedGroupId
            );
            setResultsData((prevState) => ({
              ...prevState,
              [lastSelectedGroupId]: groupDataResponse,
            }));

            setSelectedTab(tabs.length);
            setTabs((prevTabs) => [
              ...prevTabs,
              {
                key: lastSelectedGroupId,
                label: selectedGroup.name,
                content: (
                  <GenericTable
                    key={lastSelectedGroupId}
                    data={groupDataResponse}
                    columns={columns}
                    enableSearch={true}
                    getRowStyle={rowHighlight}
                  />
                ),
                close: true,
              },
            ]);
          } catch (error) {
            setSelectedTab(tabs.length);
            setTabs((prevTabs) => [
              ...prevTabs,
              {
                key: lastSelectedGroupId,
                label: selectedGroup.name,
                content: (
                  <AlertBox
                    type={"error"}
                    message={
                      "Error loading the group results. Please close the tab and try again."
                    }
                  />
                ),
                close: true,
              },
            ]);
          } finally {
            setLoading(false);
          }
        };
        fetchGroupData();
      }
    }
  }, [lastSelectedGroupId]);

  //TabPanel

  const handleRemoveTab = (index) => {
    const groupId = tabs[index].key;
    setSelectedGroups((prevGroups) =>
      prevGroups.filter((group) => group !== groupId)
    );
    setTabs((prevTabs) => prevTabs.filter((_, i) => i !== index));
    setSelectedTab((prevSelected) =>
      prevSelected === index
        ? Math.max(0, index - 1)
        : prevSelected > index
        ? prevSelected - 1
        : prevSelected
    );
    setLastSelectedGroupId(null);
  };

  const handleDownloadResultsForEvent = async () => {
    const payload = {
      group_ids: selectedGroups.filter((id) => id !== "placeholder"),
    };
    try {
      await SmmApi.downloadResultsForEvent(
        swimMeetName,
        eventName,
        eventId,
        payload
      );
    } catch (error) {
      console.error("Download failed:", error);
      alert("There was an error downloading the file. Please try again.");
    }
  };

  //What is needed for the itemPaginationBar
  const label = "Event " + eventName;
  const extraButtons = [
    {
      label: "Back to events",
      icon: <BackIcon />,
      onClick: onBack,
    },
    {
      label: "Show Heats",
      icon: <HeatIcon />,
      onClick: onHeats,
    },
    {
      label: "Download Results",
      icon: <DownloadIcon />,
      onClick: handleDownloadResultsForEvent,
      disabled: !checkEventHasResults(resultsData.main),
    },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <Stack
          alignItems="center"
          justifyContent="center"
          style={{ height: "100px" }}
        >
          <CircularProgress />
        </Stack>
      );
    }
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
          <AlertBox
            type="error"
            message="We were unable to load the required data. Please try again."
          />
        </Stack>
      );
    }

    if (hasResults === null) {
      return (
        <Stack
          alignItems="center"
          justifyContent="center"
          style={{ height: "100px" }}
        >
          <CircularProgress />
        </Stack>
      );
    }

    if (hasResults) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {groupOptions.length > 0 && (
            <MultiSelectWithTags
              key={"multi-select"}
              label={"Filter by group"}
              options={groupOptions}
              selectedOptions={selectedGroups}
              setSelectedOptions={setSelectedGroups}
              setLastSelected={setLastSelectedGroupId}
            />
          )}
          <TabPanel
            tabs={tabs}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            onRemoveTab={handleRemoveTab}
          />
        </div>
      );
    }

    if (!hasResults) {
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
          <AlertBox
            type="success"
            message={"This event does not have results yet"}
          />
        </Stack>
      );
    }

    return null;
  };

  return (
    <div>
      <ItemPaginationBar
        label={label}
        onPrevious={onPrevious}
        onNext={onNext}
        disablePrevious={disablePrevious}
        disableNext={disableNext}
        extraActions={extraButtons}
      ></ItemPaginationBar>
      {renderContent()}
    </div>
  );
};

export default EventResults;
