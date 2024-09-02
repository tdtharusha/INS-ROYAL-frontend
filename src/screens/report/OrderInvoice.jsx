import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';
import QRCode from 'qrcode';

const OrderInvoice = ({ order }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (order) {
      generateQRCode();
    }
  }, [order]);

  const generateQRCode = async () => {
    try {
      const qrCodeData = JSON.stringify({
        orderId: order._id,
        total: order.totalPrice,
        date: order.createdAt,
      });
      const url = await QRCode.toDataURL(qrCodeData);
      setQrCodeUrl(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  if (!order) return null;

  return (
    <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, backgroundColor: '#f0f0f0' }}>
        <Typography
          variant='h4'
          align='center'
          sx={{ backgroundColor: '#f44336', color: 'white', py: 2 }}
        >
          INS ROYAL Restaurant
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography>Name: {order.user?.name}</Typography>
          <Typography>
            Date: {new Date(order.createdAt).toISOString().split('T')[0]}
          </Typography>
          <Typography>ID: {order._id}</Typography>
        </Box>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                <TableCell>Product ID</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align='right'>Price</TableCell>
                <TableCell align='right'>SubTotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.orderItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align='right'>
                    Rs {item.unitPrice} x {item.quantity}
                  </TableCell>
                  <TableCell align='right'>
                    Rs {item.unitPrice * item.quantity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container justifyContent='flex-end' sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography align='right'>SubTotal: Rs {order.subTotal}</Typography>
            <Typography align='right'>Shipping Price: Rs {order.shippingPrice}</Typography>
            <Typography variant='h6' align='right'>
              Total Price: Rs {order.totalPrice}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          {qrCodeUrl && <img src={qrCodeUrl} alt='Order QR Code' />}
        </Box>

        <Typography sx={{ mt: 2, fontSize: '0.8rem' }}>
          CreatedBy: {order.user?.name}
        </Typography>
      </Paper>
    </Container>
  );
};

export default OrderInvoice;
