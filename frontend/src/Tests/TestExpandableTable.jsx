import ExpandableTable from "../components/Common/ExpandableTable";
import {
    Edit as EditIcon,
} from "@mui/icons-material";

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
    {
      id: 3,
      name: "Heat 3",
      heats: [
        {
          id: 22,
          lane: 1,
          athlete_full_name: "Hola",
          seed_time: 2,
          heat_time: "",
        },
        {
          id: 23,
          lane: 2,
          athlete_full_name: "Adios",
          seed_time: 2,
          heat_time: "",
        },
      ],
    },
    {
      id: 4,
      name: "Heat 4",
      heats: [
        {
          id: 22,
          lane: 1,
          athlete_full_name: "Hola",
          seed_time: 2,
          heat_time: "",
        },
        {
          id: 23,
          lane: 2,
          athlete_full_name: "Adios",
          seed_time: 2,
          heat_time: "",
        },
      ],
    },
    {
      id: 5,
      name: "Heat 5",
      heats: [
        {
          id: 22,
          lane: 1,
          athlete_full_name: "Hola",
          seed_time: 2,
          heat_time: "",
        },
        {
          id: 23,
          lane: 2,
          athlete_full_name: "Adios",
          seed_time: 2,
          heat_time: "",
        },
      ],
    },
    {
      id: 6,
      name: "Heat 6",
      heats: [
        {
          id: 22,
          lane: 1,
          athlete_full_name: "Hola",
          seed_time: 2,
          heat_time: "",
        },
        {
          id: 23,
          lane: 2,
          athlete_full_name: "Adios",
          seed_time: 2,
          heat_time: "",
        },
      ],
    },
    {
      id: 7,
      name: "Heat 7",
      heats: [
        {
          id: 22,
          lane: 1,
          athlete_full_name: "Hola",
          seed_time: 2,
          heat_time: "",
        },
        {
          id: 23,
          lane: 2,
          athlete_full_name: "Adios",
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

const TestExpandableTable = () => {

    const handleEditClick = () => {
        console.log("Edit ...");
      };

    const actions = [
        {
          name: "Edit",
          icon: <EditIcon />,
          onClick: handleEditClick,
          tip: "Edit athletes",
        },
      ];
  return (
    <div>
      <ExpandableTable
        data={testData}
        columns={mainTableColumns}
        actions={actions}
        subTableColumns={subTableColumns}
        subData={'heats'}
      />
    </div>
  );
};

export default TestExpandableTable;
