import ExpandableTable from "../components/Common/ExpandableTable";
import GenericTable from "../components/Common/GenericTable";
import { Typography } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const testData = [
  {
    id: 1,
    name: "Heat 1",
    heats: [
      {
        id: 12,
        lane: 1,
        athlete_full_name: "Hola",
        seed_time: 2,
        heat_time: "",
      },
      {
        id: 13,
        lane: 2,
        athlete_full_name: "Adios",
        seed_time: 2,
        heat_time: "",
      },
      {
        id: 22,
        lane: 3,
        athlete_full_name: "Carlos",
        seed_time: 2,
        heat_time: "",
      },
      {
        id: 23,
        lane: 4,
        athlete_full_name: "Gerardo",
        seed_time: 2,
        heat_time: "",
      },
      {
        id: 24,
        lane: 5,
        athlete_full_name: "Pedro",
        seed_time: 2,
        heat_time: "",
      },
    ],
  },
  {
    id: 2,
    name: "Heat 2",
    heats: [
      {
        id: 14,
        lane: 1,
        athlete_full_name: "Hola",
        seed_time: 2,
        heat_time: "",
      },
    ],
  },
];

const mainTableColumns = [
  {
    accessorKey: "name",
    header: "",
    size: 150,
  },
];

const subTableColumns = [
  {
    accessorKey: "lane",
    header: "Lane",
    size: 150,
  },
  {
    accessorKey: "athlete_full_name",
    header: "Athlete",
    size: 150,
  },
  {
    accessorKey: "seed_time",
    header: "Seed Time",
    size: 150,
  },
  {
    accessorKey: "heat_time",
    header: "Heat Time",
    size: 150,
  },
];

const TestConditionalRender = () => {
  const handleEditClick = () => {
    console.log("Edit ...");
  };

  const handleDeleteClick = () => {
    console.log("Delete ...");
  };

  const actions = [
    {
      name: "Edit",
      icon: <EditIcon />,
      onClick: handleEditClick,
      tip: "Edit athletes",
      visible: (row) => row.original.name == "Heat 1",
    },
    {
      name: "Delete",
      icon: <DeleteIcon />,
      onClick: handleDeleteClick,
      tip: "Delete",
    },
  ];
  return (
    <div>
      <Typography
        key={1}
        variant={"h4"}
        component="div"
        sx={{ color: "text.secondary" }}
      >
        Expandable table
      </Typography>
      <ExpandableTable
        data={testData}
        columns={mainTableColumns}
        actions={actions}
        subTableColumns={subTableColumns}
        subData={"heats"}
      />
      <Typography
        key={2}
        variant={"h4"}
        component="div"
        sx={{ color: "text.secondary" }}
      >
        Generic table
      </Typography>
      <GenericTable
        data={testData}
        columns={mainTableColumns}
        actions={actions}
      />
    </div>
  );
};

export default TestConditionalRender;
