
import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  CircularProgress,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

// helper function to format date objects or firestore timestamps
const formatTimestamp = (value) => {
  // handle firestore timestamp objects (with _seconds and _nanoseconds)
  if (value && typeof value === 'object' && '_seconds' in value) {
    // convert to javascript date
    return new Date(value._seconds * 1000).toLocaleString();
  }

  // handle date objects
  if (value instanceof Date) {
    return value.toLocaleString();
  }

  // return the value as is if it's already a string or other primitive
  return value;
};

// helper function to safely get a property value
const safeGetValue = (obj, path, defaultValue = '') => {
  if (!obj) return defaultValue;

  // handle direct property access
  if (typeof path === 'string' && path in obj) {
    return obj[path];
  }

  return defaultValue;
};

const ManagementList = ({
  columns,
  items,
  loading,
  onEditClick,
  onDetailClick,
  onDeleteClick,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // make sure items is always an array and filter out undefined/null rows
  const safeItems = Array.isArray(items) ? items.filter(item => item !== null && item !== undefined) : [];
  const visibleRows = safeItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // generate a unique key for each row
  const getRowKey = (row, index) => {
    // use the row's id if available, otherwise use the index
    return row && row.id ? row.id : `row-${index}`;
  };

    const handleActionClick = (handler, rowId) => {
        if (!handler) return;
        handler(rowId);
    };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.numeric ? 'right' : 'left'}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.headerName}
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, rowIndex) => (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={getRowKey(row, rowIndex)}
              >
                {columns.map((column) => {
                  // safely get the value from the row, handling undefined properties
                  const value = safeGetValue(row, column.field);

                  const displayValue = column.renderCell
                    ? column.renderCell({ row })
                    : (
                      // format timestamp objects or return the value directly
                      column.field.toLowerCase().includes('date') ||
                      column.field.toLowerCase().includes('at') ||
                      column.field.toLowerCase().includes('time')
                        ? formatTimestamp(value)
                        : (value !== null && value !== undefined ? String(value) : '')
                    );

                  return (
                    <TableCell key={column.field} align={column.numeric ? 'right' : 'left'}>
                      {displayValue}
                    </TableCell>
                  );
                })}
                <TableCell align="right">
                  {onDetailClick && (
                    <Tooltip title="View details">
                      <IconButton
                        onClick={() => handleActionClick(onDetailClick, row?.id)}
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {onEditClick && (
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleActionClick(onEditClick, row?.id)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {onDeleteClick && (
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleActionClick(onDeleteClick, row?.id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={safeItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ManagementList;