import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Tooltip,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrederMutation,
} from '../../slices/order/orderApiSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });

  const { data, isLoading, isError } = useGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrederMutation();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success('update order status successfully');
    } catch (err) {
      console.error('Failed to update order status:', err);
      toast.error('Failed to update order status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this Brand?')) {
      try {
        await deleteOrder(id).unwrap();
        toast.success('Order deleted successfully');
      } catch (err) {
        toast.success('Order deleted successfully', err);
      }
    }
  };

  const columns = [
    { field: '_id', headerName: 'Order ID', flex: 1 },
    {
      field: 'user',
      headerName: 'User',
      flex: 1,
      renderCell: (params) => params.row.user.name,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) =>
        new Date(params.row.createdAt).toLocaleDateString(),
    },
    {
      field: 'totalPrice',
      headerName: 'Total',
      flex: 1,
      renderCell: (params) => `Rs.${params.row.totalPrice.toFixed(2)}`,
    },
    {
      field: 'isPaid',
      headerName: 'Paid',
      flex: 1,
      renderCell: (params) => (params.value ? 'Yes' : 'No'),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      align: 'left',
      renderCell: (params) => (
        <FormControl fullWidth>
          <Select
            value={params.row.status}
            onChange={(e) => handleStatusChange(params.row._id, e.target.value)}
          >
            <MenuItem value='New'>New</MenuItem>
            <MenuItem value='Processing'>Processing</MenuItem>
            <MenuItem value='Delivering'>Delivering</MenuItem>
            <MenuItem value='Complete'>Complete</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <strong>
          <Tooltip title='Delete'>
            <IconButton color='error' onClick={() => handleDelete(params.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </strong>
      ),
    },
  ];

  if (isLoading) return <Loader />;
  if (isError)
    return <Typography color='error'>Error loading brands</Typography>;

  return (
    <Box sx={{ height: '70vh', width: '100%', p: 2 }}>
      <Typography variant='h5'>Order List</Typography>
      <br />
      <Paper elevation={3} sx={{ height: '50vh', width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row._id || row.date}
          components={{ Toolbar: GridToolbar }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortingModel={sortModel}
          onSortingModelChange={setSortModel}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          autoPageSize
          {...data}
          checkboxSelection={!isSmallScreen}
          disableSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          sx={{
            '& .MuiDataGrid-toolbarContainer': {
              borderBottom: 'solid 1px rgba(224, 224, 224, 1)',
              p: 1,
            },
            '& .MuiDataGrid-cell': {
              borderBottom: 'solid 1px rgba(224, 224, 224, 0.8)',
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: 'solid 2px rgba(224, 224, 224, 1)',
              bgcolor: 'background.paper',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default OrderListScreen;
