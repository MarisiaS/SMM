import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";

const GenericTable = ({ data, columns, actions }) => {
  const enableActions = actions;
  const theme = useTheme();
  console.log(theme.palette.primary);
  const table = useMaterialReactTable({
    columns: columns,
    data: data,
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },
    },
    enableSorting: false,
    enableRowActions: enableActions,
    positionActionsColumn: "last",
    initialState: { density: "compact" },
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,

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
  });

  return <MaterialReactTable table={table} />;
};

export default GenericTable;
