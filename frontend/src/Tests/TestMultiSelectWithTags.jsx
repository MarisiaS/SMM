import { useState, useEffect } from "react";
import MultiSelectWithTags from "../components/Common/MultiSelectWithTags";
import { Button } from "@mui/material";

const groups = [
  { id: 1, name: "Girls" },
  { id: 2, name: "Boys" },
  { id: 3, name: "Mixed" },
  { id: 4, name: "Girls10&Under" },
];

const TestMultiSelectWithTags = ({}) => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [lastSelectedGroupId, setLastSelectedGroupId] =
    useState(null);
  const [buttons,setButtons] = useState([]);

  useEffect(() => {
    if (lastSelectedGroupId) {
        const selectedGroup = groups.find((group) => group.id === lastSelectedGroupId);
        setButtons((prevButtons) => [...prevButtons, { id: selectedGroup.id, name: selectedGroup.name}])
    }
  }, [lastSelectedGroupId]);

  const handleRemoveButton = (id) => {
    setButtons((prevButtons) => prevButtons.filter((button) => button.id !== id));
    setSelectedGroups((prevGroups) => prevGroups.filter((groupId) => groupId !== id));
    setLastSelectedGroupId(null);
  };

  return (
    <div className={"test"}>
      <br/>
      <MultiSelectWithTags
        key={1}
        label={"Filter by group"}
        options={groups}
        selectedOptions={selectedGroups}
        setSelectedOptions={setSelectedGroups}
        setLastSelected={setLastSelectedGroupId}
      />
      <br />
      {buttons.map((button) => (
        <Button
          key={button.id}
          variant="contained"
          color="primary"
          onClick={() => handleRemoveButton(button.id)}
          sx={{ margin: 1 }}
        >
          {button.name}
        </Button>
      ))}
    </div>
  );
};

export default TestMultiSelectWithTags;
