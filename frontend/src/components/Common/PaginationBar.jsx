import { useState } from "react";
import TablePagination from "@mui/material/TablePagination";

import { useTheme } from "@mui/material";

export default function PaginationBar({ count, setOffset, setLimit }) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOffset(newPage * rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setLimit(parseInt(event.target.value, 10));
    setOffset(0);
  };

  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[5,10,15,20]}
      sx={{
        color: theme.palette.text.primary,
      }}
    />
  );
}