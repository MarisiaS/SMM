import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";

const ExpandableTable = ({
  data,
  columns,
  actions,
  getSubTableColumns,
  subData,
}) => {
  const enableActions = actions;
  const theme = useTheme();

  const table = useMaterialReactTable({
    columns: columns,
    data: data,
    enableExpanding: true,
    enableExpandAll: true,
    muiTableHeadCellProps: {
      sx: {
        //Does not show the header
        //display: "none",
      },
    },
    enableSorting: false,
    enableRowActions: enableActions,
    positionActionsColumn: "last",
    initialState: {
      density: "compact",
      //All rows are expanded at the beginning
      expanded: data.reduce((expandedState, _, rowIndex) => {
        expandedState[rowIndex] = true;
        return expandedState;
      }, {}),
    },
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,
    enablePagination: false,

    // Render the row actions
    renderRowActions: ({ row }) => (
      <Box>
        {actions &&
          actions.map((action, index) => {
            let shouldRender = true;
            if (action.visible) {
              shouldRender = action.visible(row);
            }
            return (
              shouldRender && (
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
              )
            );
          })}
      </Box>
    ),

    // Render a new table in the expanded row
    renderDetailPanel: ({ row }) => {
      const subTableData = row.original[subData];
      const subTableColumns = getSubTableColumns(row.index);
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
