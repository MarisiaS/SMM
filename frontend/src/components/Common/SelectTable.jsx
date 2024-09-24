import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const SelectTable = ({ data, columns, rowSelection, setRowSelection }) => {
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
    muiTableHeadProps: {
      sx: {
        visibility: "collapse", // Hide table headers but keep the layout intact
      },
    },
    getRowId: (originalRow) => originalRow.id, // Use 'id' as the unique identifier for rows
    onRowSelectionChange: setRowSelection, // Sync row selection state with parent component
    state: { rowSelection }, // Pass the current row selection state to the table
    enableRowVirtualization: true, // Allow vertical scrolling for rows
    enableSorting: false,
    initialState: { density: "compact", showGlobalFilter: true }, // Show search input (GlobalFilter)
    enableTopToolbar: true,
    enableToolbarInternalActions: false,
    positionToolbarAlertBanner: "bottom", // Display an alert banner at the bottom with selection info
    enableBottomToolbar: true,
    enableColumnActions: false,
    enablePagination: false,
    muiTableBodyProps: {
      sx: {
        maxHeight: "400px", // Set a maximum height for the table body
        minHeight: "400px", // Set a minimum height for the table body
        overflowY: "auto", // Enable vertical scrolling
        overflowX: "hidden", // Disable horizontal scrolling
      },
    },
  });

  return <MaterialReactTable table={table} />;
};

export default SelectTable;
