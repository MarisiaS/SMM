import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";

const GenericTable = ({ data, columns, actions, notRecordsMessage, enableSearch, getRowStyle }) => {
  const enableActions = actions;
  const theme = useTheme();
  const table = useMaterialReactTable({
    columns: columns,
    data: data,
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: getRowStyle ? getRowStyle(row) : {},
    }),
    enableSorting: false,
    enableRowActions: enableActions,
    positionActionsColumn: "last",
    initialState: { density: "compact", showGlobalFilter: enableSearch ? enableSearch : false },
    enableTopToolbar: enableSearch ? enableSearch : false,
    enableToolbarInternalActions: false,
    enableBottomToolbar: false,
    enableColumnActions: false,
    enablePagination: false,
    localization: {
      noRecordsToDisplay: notRecordsMessage,
    },

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
  });

  return <MaterialReactTable table={table} />;
};

export default GenericTable;
