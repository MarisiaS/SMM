import { useState } from "react";
import ItemPaginationBar from "../components/Common/ItemPaginationBar";
import { MoveUp as BackIcon, Add as AddIcon } from "@mui/icons-material";

const data = [
  {
    id: 1,
    num_event: 1,
    name: "#1 Girls 50 FLY",
    group: 1,
    group_name: "Girls",
    event_type: 1,
    event_type_name: "50 FLY",
  },
  {
    id: 2,
    num_event: 2,
    name: "#2 Boys 50 FR",
    group: 2,
    group_name: "Boys",
    event_type: 3,
    event_type_name: "50 FR",
  },
  {
    id: 3,
    num_event: 3,
    name: "#3 Mixed 50 FLY",
    group: 3,
    group_name: "Mixed",
    event_type: 1,
    event_type_name: "50 FLY",
  },
  {
    id: 4,
    num_event: 4,
    name: "#4 Girls10&Under 200 FR",
    group: 5,
    group_name: "Girls10&Under",
    event_type: 6,
    event_type_name: "200 FR",
  },
  {
    id: 5,
    num_event: 5,
    name: "#5 Boys11&Above 50 FR",
    group: 7,
    group_name: "Boys11&Above",
    event_type: 3,
    event_type_name: "50 FR",
  },
];

const TestItemPaginationBar = () => {
  const [itemIndex, setItemIndex] = useState(0);

  const handleBackClick = () => {
    console.log("Back press");
  };

  const handleAddClick = () => {
    console.log("Add press");
  };

  const handlePrevious = () => {
    setItemIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setItemIndex((prev) => prev + 1);
  };

  const isFirstItem = itemIndex === 0;
  const isLastItem = itemIndex >= data.length - 1;

  const extraActions = [
    {
      label: "Back to events",
      icon: <BackIcon />,
      onClick: handleBackClick,
    },
    {
      label: "Add event",
      icon: <AddIcon />,
      onClick: handleAddClick,
    },
  ];

  return (
    <div className={"test"}>
      <ItemPaginationBar
        label={data[itemIndex].name}
        onPrevious={handlePrevious}
        onNext={handleNext}
        disablePrevious={isFirstItem}
        disableNext={isLastItem}
        extraActions={extraActions}
      ></ItemPaginationBar>
      <ItemPaginationBar
        label={data[itemIndex].name}
        onPrevious={handlePrevious}
        onNext={handleNext}
        disablePrevious={isFirstItem}
        disableNext={isLastItem}
        extraActions={extraActions}
        disableNav={true}
      ></ItemPaginationBar>
    </div>
  );
};

export default TestItemPaginationBar;
