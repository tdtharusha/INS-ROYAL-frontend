import React, { useState, useMemo } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import { useGetInventoryReportQuery } from '../../slices/report/reportApiSlice';
import ReportPrintPreview from './ReportPrintPreview';
import Loader from '../../components/Loader';

const InventoryReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showReport, setShowReport] = useState(false);

  const {
    data: reportData,
    isLoading,
    isError,
  } = useGetInventoryReportQuery(
    { startDate, endDate },
    {
      skip: !showReport || !startDate || !endDate,
      refetchOnMountOrArgChange: true,
    }
  );

  const handleViewReport = () => {
    if (startDate && endDate) {
      setShowReport(true);
    }
  };

  const inventoryData = useMemo(() => {
    return reportData?.data || [];
  }, [reportData]);

  const summary = useMemo(() => {
    if (inventoryData.length === 0) return [];
    return [
      { label: 'Total Items', value: inventoryData.length },
      {
        label: 'Total Quantity',
        value: inventoryData.reduce((sum, item) => sum + item.quantity, 0),
      },
    ];
  }, [inventoryData]);

  const columns = [
    { field: 'productName', header: 'Product Name', align: 'left', flex: 0 },
    { field: 'quantity', header: 'Quantity', align: 'center', flex: 1 },
    { field: 'unit', header: 'Unit', align: 'center', flex: 1 },
    {
      field: 'reorderLevel',
      header: 'Reorder Level',
      align: 'center',
      flex: 1,
    },
  ];

  const title = `Inventory Report \n expenses since ${new Date(
    startDate
  ).toLocaleString()} to ${new Date(endDate).toLocaleString()} `;

  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Inventory Report
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
          data={inventoryData}
          columns={columns}
          showTotal={false}
          summary={summary}
        />
      )}
    </Box>
  );
};

export default InventoryReport;
