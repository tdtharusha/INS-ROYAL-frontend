import React, { useState } from 'react';
import {
  useGetGRNsQuery,
  useUpdateGRNMutation,
  useDeleteGRNMutation,
} from '../../slices/grn/grnApiSlice';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Button,
  Box,
  Tooltip,
  IconButton,
  Typography,
  Paper,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const GRNListScreen = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [paginationModel, setPaginationModel] = useState();
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });

  const [openItemsDialog, setOpenItemsDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const { data: grnsData, isLoading, isError, error } = useGetGRNsQuery();
  const [updateGRN] = useUpdateGRNMutation();
  const [deleteGRN] = useDeleteGRNMutation();
  console.log('GRNs data:', grnsData);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateGRN({ id, status: newStatus }).unwrap();
      toast.success('GRN status updated successfully');
      //refetch();
    } catch (err) {
      toast.error('Failed to update GRN status');
    }
  };

  const handleViewItems = (items) => {
    setSelectedItems(items);
    setOpenItemsDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this Product?'))
      try {
        await deleteGRN(id).unwrap();
        toast.success('GRN deleted successfully');
        //refetch();
      } catch (err) {
        toast.error('Failed to delete GRN');
        console.log('delete error:', err);
      }
  };

  const handleEdit = (id) => {
    navigate(`/grn/${id}/edit`);
  };

  const handleCreateGRN = () => {
    navigate(`/grn/createGRN`);
  };

  const columns = [
    { field: 'grnNumber', headerName: 'GRN Number', flex: 1, sortable: true },
    {
      field: 'supplier',
      headerName: 'Supplier',
      flex: 1,
      sortable: true,
      renderCell: (params) => params.value.supplierName,
    },
    {
      field: 'brand',
      headerName: 'Brand',
      flex: 0.8,
      sortable: true,
      renderCell: (params) => params.value.name,
    },

    {
      field: 'dateReceived',
      headerName: 'Date Received',
      flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Select
          value={params.value || ''}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
        >
          <MenuItem value='Pending'>Pending</MenuItem>
          <MenuItem value='Complete'>Complete</MenuItem>
          <MenuItem value='Cancelled'>Cancelled</MenuItem>
        </Select>
      ),
    },
    { field: 'notes', headerName: 'Notes', flex: 1 },
    {
      field: 'items',
      headerName: 'Items',
      flex: 1,
      renderCell: (params) => (
        <Button onClick={() => handleViewItems(params.value || [])}>
          View Items
        </Button>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      width: 80,
      renderCell: (params) => (
        <Box>
          <Tooltip title='Edit'>
            <IconButton onClick={() => handleEdit(params.row.id)} size='small'>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              size='small'
              color='error'
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const grns = grnsData
    ? grnsData.map((grn) => ({
        ...grn,
        id: grn._id,
      }))
    : [];

  if (isLoading) return <Loader />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <Box sx={{ height: '70vh', width: '100%', p: 2 }}>
      <Typography variant='h5' gutterBottom>
        GRN List
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Button
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={handleCreateGRN}
        >
          Create New GRN
        </Button>
      </Box>

      <Paper elevation={3} sx={{ height: '50vh', width: '100%' }}>
        <DataGrid
          rows={grns}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          disableSelectionOnClick
          autoPageSize
          {...grns}
          components={{ Toolbar: GridToolbar }}
          checkboxSelection={!isSmallScreen}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Paper>
      <Dialog open={openItemsDialog} onClose={() => setOpenItemsDialog(false)}>
        <DialogTitle>GRN Items</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {selectedItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '8px',
                  minWidth: '250px',
                  textAlign: 'center',
                }}
              >
                <strong>Product Name:</strong>
                <Typography variant='body2'>{item.productName}</Typography>

                <strong>Category:</strong>
                <Typography variant='body2'>{item.category}</Typography>

                <strong>Quantity:</strong>
                <Typography variant='body2'>
                  {item.quantityReceived} {item.unit}
                </Typography>

                <strong>Unit Price:</strong>
                <Typography variant='body2'>
                  Rs.{item.unitPrice.toFixed(2)}
                </Typography>

                <strong>Total Price:</strong>
                <Typography variant='body2'>
                  Rs.{item.totalPrice.toFixed(2)}
                </Typography>

                <strong>Expiry Date:</strong>
                <Typography variant='body2'>
                  {new Date(item.expiryDate).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenItemsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GRNListScreen;
