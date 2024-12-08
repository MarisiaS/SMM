import ExpandableTable from "../components/Common/ExpandableTable";
import { formatTime } from "../utils/helperFunctions.js";

const DetailsByHeat = ({ heatData }) => {
  //Need data for heat tables
  const mainHeatTableColumns = [
    {
      accessorKey: "heat_name",
      header: "",
      size: 200,
      Cell: ({ cell }) => <strong>{cell.getValue()}</strong>,
    },
  ];

  const getSubHeatTableColumns = (rowId) => [
    {
      accessorKey: "lane_num",
      header: "Lane",
      size: 50,
    },
    {
      accessorKey: "athlete_full_name",
      header: "Athlete",
      size: 150,
    },
    {
      accessorKey: "seed_time",
      header: "Seed Time",
      size: 100,
      Cell: ({ cell }) => formatTime(cell.getValue()),
    },
    {
      accessorKey: "heat_time",
      header: "Heat Time",
      size: 100,
      Cell: ({ cell }) => formatTime(cell.getValue()),
    },
  ];

  return (
    <div>
      <ExpandableTable
        data={heatData}
        columns={mainHeatTableColumns}
        getSubTableColumns={getSubHeatTableColumns}
        subData={"lanes"}
      />
    </div>
  );
};

export default DetailsByHeat;
