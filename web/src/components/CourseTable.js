import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useEffect } from 'react';
import CherryService from '../services/CherryService';
const columns = [
  { id: 'Subject', label: 'Subject', minWidth: 170 },
  { id: 'Number', label: 'Number', minWidth: 100 },
  { id: 'Course Title', label: 'Course Title', minWidth: 170 },
  { id: 'GPA', label: 'GPA', minWidth: 170 },
];

export default function StickyHeadTable() {
  // TODO: Update this via API Call
  const [rowsCount, setRowsCount] = React.useState(2000);
  const [page, setPage] = React.useState(0);

  // page number => array courses of that page
  const [rows, setRows] = React.useState({ 1: [] });

  useEffect(() => {
    console.log('useEffect');
    CherryService.getAllCourses({ page: 1 }).then(response => {
      setRows({ 1: response })
    });
    CherryService.getCourseListMeta().then(response => {
      setRowsCount(response.numberOfCourses);
    });
  }, []);

  const handleChangePage = async (event, newPage) => {
    newPage = newPage + 1;
    if (!rows[newPage]) {
      setRows({ ...rows, [newPage]: [] })
      await CherryService.getAllCourses({ page: newPage })
        .then(response => setRows({ ...rows, [newPage]: response }));
    }
    setPage(newPage - 1);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows[page + 1] ?
              rows[page + 1]
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })
                      }
                    </TableRow>
                  );
                }) : <TableRow></TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={rowsCount}
        rowsPerPage={100}
        page={page}
        onPageChange={handleChangePage}
      />
    </Paper>
  );
}
