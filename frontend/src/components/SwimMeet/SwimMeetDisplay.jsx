import { useMemo, useState, useEffect } from "react";
import { SmmApi } from "../../SmmApi";
import GenericTable from "../Common/GenericTable";
import SearchBar from "../Common/SearchBar";

const SwimMeetDisplay = () => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 150,
      },
      {
        accessorKey: "time",
        header: "Time",
        size: 150,
      },
      {
        accessorKey: "site_name",
        header: "Site",
        size: 150,
      },
    ],
    []
  );

  useEffect(() => {
    let ignore = false;
    async function startFetching() {
      const json = await SmmApi.getSwimMeetList();
      console.log(json);
      if (!ignore) {
        setData(json.results);
      }
    }
    startFetching();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div>
      <SearchBar></SearchBar>
      <GenericTable data={data} columns={columns} />
    </div>
  );
};

export default SwimMeetDisplay;
