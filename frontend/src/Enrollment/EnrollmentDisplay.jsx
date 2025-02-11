import { PersonRemove as UnenrollIcon } from "@mui/icons-material";
import GenericTable from "../components/Common/GenericTable";

const testData = [
  {
    id: 2,
    athlete_full_name: "Ana Gomez",
  },
  {
    id: 10,
    athlete_full_name: "Anna Anderson",
  },
  {
    id: 16,
    athlete_full_name: "Ava Wilson",
  },
  {
    id: 4,
    athlete_full_name: "Elena Lopez",
  },
  {
    id: 12,
    athlete_full_name: "Ellie Yuan",
  },
  {
    id: 8,
    athlete_full_name: "Kyla Smith",
  },
  {
    id: 6,
    athlete_full_name: "Laura Sanchez",
  },
  {
    id: 15,
    athlete_full_name: "Olivia Davis",
  },
  {
    id: 11,
    athlete_full_name: "Sofia Avila",
  },
];

const columns = [
  {
    accessorKey: "full_name",
    header: "Athlete Name",
    size: 150,
  },
];

const EnrollmentDisplay = () => {
  const handleUnEnrollmentClick = (id) => {
    console.log("Unenroll", id);
  };
  const actions = [
    {
      name: "Unenroll",
      icon: <UnenrollIcon />,
      onClick: handleUnEnrollmentClick,
      tip: "Unenroll Athlete",
    },
  ];

  const renderContent = () => {
    return <GenericTable data={data} columns={columns} actions={actions} />;
  };

  return <div>{renderContent()}</div>;
};

export default EnrollmentDisplay;
