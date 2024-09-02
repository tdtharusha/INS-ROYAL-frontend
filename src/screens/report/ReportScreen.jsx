import React, { useState } from 'react';
import { Box, Typography, Tab, Tabs } from '@mui/material';
import ExpenseReport from './ExpenseReport';
import RevenueReport from './RevenueReport';
import ProfitReport from './ProfitReport';
import InventoryReport from './InventoryReport';

const ReportScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant='h4' sx={{ mb: 2 }}>
        Reports
      </Typography>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        {/* <Tab label='Order Invoice' /> */}
        <Tab label='Revenue' />
        <Tab label='Expense' />
        <Tab label='Pre Made Foods Inventory' />
        <Tab label='Profit' />
      </Tabs>
      {selectedTab === 0 && <RevenueReport />}
      {selectedTab === 1 && <ExpenseReport />}
      {selectedTab === 2 && <InventoryReport />}
      {selectedTab === 3 && <ProfitReport />}
    </Box>
  );
};

export default ReportScreen;
