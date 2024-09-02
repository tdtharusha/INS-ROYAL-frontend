import React, { useState, useMemo } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useGetExpenseReportQuery } from '../../slices/report/reportApiSlice';
import ReportPrintPreview from './ReportPrintPreview';
import Loader from '../../components/Loader';

const ExpenseReport = ({ data }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showReport, setShowReport] = useState(false);

  const {
    data: reportData,
    isLoading,
    isError,
  } = useGetExpenseReportQuery({ startDate, endDate }, { skip: !showReport });

  // console.log('Expenses report data:', reportData);

  const handleViewReport = () => {
    setShowReport(true);
  };

  const rowsWithId = useMemo(() => {
    return (
      reportData?.data.items.map((item, index) => ({
        ...item,
        id: index, // Use the index as a unique id
      })) || []
    );
  }, [reportData]);

  const columns = [
    { field: 'productName', header: 'Item', align: 'left', flex: 1 },
    { field: 'totalQuantity', header: 'Quantity', align: 'left', flex: 1 },
    {
      field: 'totalExpense',
      header: 'Total Expenses',
      align: 'right',
      flex: 1,
      format: (value) => `${value} LKR`,
    },
  ];

  const title = `Expenses Report \n expenses since ${new Date(
    startDate
  ).toLocaleString()} to ${new Date(endDate).toLocaleString()} `;

  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Expenses Report
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label='Start Date'
          type='date'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label='End Date'
          type='date'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant='contained'
          onClick={handleViewReport}
          disabled={!startDate || !endDate}
        >
          View Report
        </Button>
      </Box>
      {isLoading && <Loader />}
      {isError && <Typography color='error'>Error loading report</Typography>}
      {reportData && (
        <ReportPrintPreview
          title={title}
          data={reportData.data.items}
          columns={columns}
        />
      )}
    </Box>
  );
};

export default ExpenseReport;
