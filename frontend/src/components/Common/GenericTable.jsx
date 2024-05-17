import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  IconButton,
  Tooltip,
  createTheme,
  ThemeProvider,
} from "@mui/material";

const GenericTable = ({ data, columns, actions }) => {
  const enableActions = actions;
  const table = useMaterialReactTable({
    columns: columns,
    data: data,
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "lightskyblue",
      },
    },
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableGlobalFilter: false,
    enableRowActions: enableActions,
    enableDensityToggle: false,
    initialState: { density: "compact" },
    positionActionsColumn: "last",

    renderRowActions: ({ row }) => (
      <Box>
        {actions &&
          actions.map((action, index) => (
            <Tooltip
              key={index}
              title={action.title}
              placement="top"
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -20],
                      },
                    },
                  ],
                },
              }}
            >
              <IconButton onClick={() => action.onClick(row.id)}>
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />
};

export default GenericTable;
