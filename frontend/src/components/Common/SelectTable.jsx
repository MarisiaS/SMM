import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useTheme, Box, Typography, Button } from "@mui/material";

const SelectTable = ({
  data,
  columns,
  rowSelection,
  setRowSelection,
  notRecordsMessage,
  searchTerm,
  setSearchTerm,
  labels
}) => {
  const theme = useTheme();
  const table = useMaterialReactTable({
    data: data,
    columns: columns,
    enableRowSelection: true, // Enable row selection
    enableSelectAll: false, // Disable the "Select All" checkbox
    muiTableBodyRowProps: ({ row }) => ({
      // Select row on click
      onClick: (event) => row.getToggleSelectedHandler()(event), // Toggle selection on row click
      style: {
        cursor: "pointer",
        userSelect: "none", // Prevent text selection
      },
    }),
    displayColumnDefOptions: {
      "mrt-row-select": { header: "" }, // Hide the header for the selection column
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },
    },
    getRowId: (originalRow) => originalRow.id, // Use 'id' as the unique identifier for rows
    onRowSelectionChange: setRowSelection, // Sync row selection state with parent component
    state: { rowSelection, globalFilter: searchTerm }, // Pass the current row selection state to the table
    enableRowVirtualization: true, // Allow vertical scrolling for rows
    enableSorting: false,
    initialState: { density: "compact", showGlobalFilter: true }, // Show search input (GlobalFilter)
    onGlobalFilterChange: setSearchTerm,
    enableTopToolbar: true,
    enableToolbarInternalActions: false,
    positionToolbarAlertBanner: "bottom", // Display an alert banner at the bottom with selection info
    enableBottomToolbar: true,
    enableColumnActions: false,
    enablePagination: false,
    muiTableContainerProps: { sx: { maxHeight: "400px", minHeight: "400px" } },
    muiTableBodyProps: {
      sx: {
        overflowY: "auto",
        overflowX: "hidden",
      },
    },
    localization: {
      noRecordsToDisplay: notRecordsMessage,
    },
    renderTopToolbarCustomActions: ({ table }) => {
      const rowCount = table.getRowModel().rows.length;
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            px: 2,
          }}
        >
          <Typography variant="body2">
          <strong>Number of {labels[0]}: {rowCount}</strong>
          </Typography>
        </Box>
      );
    },
    renderToolbarAlertBannerContent: ({ table }) => {
      const selectedRowCount = table.getSelectedRowModel().rows.length;
      const totalRowCount = table.getRowModel().rows.length;

      return selectedRowCount > 0 ? (
        <Box sx={{ padding: 1, display: "flex", alignItems: "center", height: "44px" }}>
          <h5>
            {totalRowCount > 1
              ? `${selectedRowCount} of ${totalRowCount} ${labels[1]}(s) selected`
              : `${selectedRowCount} of ${totalRowCount} ${labels[1]} selected`}
          </h5>
          <Button
            onClick={() => table.resetRowSelection()}
            variant="text"
            color="secondary"
            disabled={rowSelection.size === 0}
          >
            Clear Selection
          </Button>
        </Box>
      ) : null;
    },
  });

  return <MaterialReactTable table={table} />;
};

export default SelectTable;
