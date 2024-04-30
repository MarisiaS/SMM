import MyTable from '../Common/MyTable';
import { useMemo } from 'react';


const SwimMeetTable = ({data}) => {
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name', 
        header: 'Name',
        size: 150,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        size: 150,
      },
      {
        accessorKey: 'time',
        header: 'Time',
        size: 150,
      },
      {
        accessorKey: 'site_name', 
        header: 'Site',
        size: 150,
      },
    ],
    [],
  );

  return <MyTable data={data} columns={columns} />;
};

export default SwimMeetTable;