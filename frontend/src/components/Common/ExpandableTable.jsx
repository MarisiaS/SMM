import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";

const ExpandableTable = ({
  data,
  columns,
  actions,
  subTableColumns,
  subData,
}) => {
  const enableActions = actions;
  const theme = useTheme();

  const table = useMaterialReactTable({
    columns: columns,
    data: data,
    enableExpanding: true,
    enableExpandAll: false,
    muiTableHeadCellProps: {
      sx: {
        //Does not show the header
        display: "none",
      },
    },
    enableSorting: false,
    enableRowActions: enableActions,
    positionActionsColumn: "last",
    initialState: {
      density: "compact",
      //First row is expanded at the beginning
      expanded: {
        0: true,
      },
    },
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,
    enablePagination: false,

    // Render the row actions
    renderRowActions: ({ row }) => (
      <Box>
        {actions &&
          actions.map((action, index) => (
            <Tooltip
              key={index}
              title={action.tip}
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

    // Render a new table in the expanded row
    renderDetailPanel: ({ row }) => {
      const subTableData = row.original[subData];
      return (
        <Box sx={{ margin: 2 }}>
          <MaterialReactTable
            columns={subTableColumns}
            data={subTableData || []}
            enableSorting={false}
            enableTopToolbar={false}
            enableBottomToolbar={false}
            enableColumnActions={false}
            enablePagination={false}
            initialState={{
              density: "compact",
            }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              },
            }}
          />
        </Box>
      );
    },
  });

  return <MaterialReactTable table={table} />;
};

export default ExpandableTable;
