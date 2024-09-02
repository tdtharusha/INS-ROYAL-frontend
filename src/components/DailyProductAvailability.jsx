import React from 'react';
import { useGetDailyProductsQuery } from '../slices/dailyProduct/dailyProductApiSlice';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const DailyProductAvailability = () => {
  const {
    data: dailyProducts,
    isLoading,
    isError,
    error,
  } = useGetDailyProductsQuery();

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error: {error.message}</Typography>;

  return (
    <TableContainer component={Paper}>
      <Typography variant='h6' gutterBottom component='div'>
        Daily Product Availability
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell align='right'>Available Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dailyProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell component='th' scope='row'>
                {product.productName}
              </TableCell>
              <TableCell align='right'>{product.availableQuantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DailyProductAvailability;
