import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TablePagination,
  Box,
} from "@mui/material";

const TableComponent = ({ data, columns }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(data.length / rowsPerPage),
    state: {
      pagination: {
        pageIndex,
        pageSize: rowsPerPage,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  const handleChangePage = (_, newPage) => {
    setPageIndex(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPageIndex(0);
  };

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
    size="small"
    sx={{
      borderCollapse: 'collapse',
      '& th, & td': {
        border: '1px solid rgba(224, 224, 224, 1)',
      },
    }}
  >
    <TableHead>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableCell key={header.id}>
              {flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableHead>
    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={data.length}
          page={pageIndex}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </Box>
  );
};

export default TableComponent;
