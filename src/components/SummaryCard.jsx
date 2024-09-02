import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const SummaryCard = ({ title, count }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant='h5' component='div'>
          {title}
        </Typography>
        <Typography variant='h4' component='div'>
          {count}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
