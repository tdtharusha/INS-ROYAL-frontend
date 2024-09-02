import React from 'react';
import { Container, Grid } from '@mui/material';
import SummaryCard from '../components/SummaryCard';

const AdminDashboard = () => {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard title='Users' count={120} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard title='Products' count={120} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard title='Orders' count={150} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
