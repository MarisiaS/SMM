import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, IconButton } from "@mui/material";

const GenericTable = ({ data, columns, actions }) => {
  const enableActions = actions;
  const table = useMaterialReactTable({
    columns: columns,
    data: data,
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: 'lightskyblue',
      },
    },
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableGlobalFilter: false,
    enableRowActions: enableActions,
    positionActionsColumn: "last",

    renderRowActions: ({ row }) => (
      <Box>
        {actions && actions.map((action, index) => (
          <IconButton key={index} onClick={() => action.onClick(row.id)}>
            {action.icon}
          </IconButton>
        ))}
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default GenericTable;
