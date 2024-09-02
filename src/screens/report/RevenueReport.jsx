import React, { useState, useMemo } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useGetRevenueReportQuery } from '../../slices/report/reportApiSlice';
import ReportPrintPreview from './ReportPrintPreview';
import Loader from '../../components/Loader';

const RevenueReport = ({ data }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showReport, setShowReport] = useState(false);

  const {
    data: reportData,
    isLoading,
    isError,
  } = useGetRevenueReportQuery({ startDate, endDate }, { skip: !showReport });

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
    { field: 'name', header: 'Item', align: 'left', flex: 1 },
    { field: 'totalQuantity', header: 'Quantity', align: 'left', flex: 1 },
    {
      field: 'totalRevenue',
      header: 'Total Revenue',
      align: 'right',
      flex: 1,
      format: (value) => `${value} LKR`,
    },
  ];

  const title = `Revenue Report \n revenue from ${new Date(
    startDate
  ).toLocaleString()} to ${new Date(endDate).toLocaleString()} `;

  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Revenue Report
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
        <Button variant='contained' onClick={handleViewReport}>
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

export default RevenueReport;
