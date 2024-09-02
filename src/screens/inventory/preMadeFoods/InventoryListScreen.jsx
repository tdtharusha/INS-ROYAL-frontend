import React, { useState, useEffect } from 'react';
import {
  useGetInventoryQuery,
  useUpdateReorderLevelMutation,
} from '../../../slices/inventory/preMadeFoodsInventory/preMadeFoodApiSlice';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
  useMediaQuery,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';

const InventoryListScreen = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [paginationModel, setPaginationModel] = useState();
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });

  const [rows, setRows] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newReorderLevel, setNewReorderLevel] = useState('');

  const {
    data: inventoryData,
    error,
    isLoading,
    refetch,
  } = useGetInventoryQuery();

  const [updateReorderLevel] = useUpdateReorderLevelMutation();

  const inventories = inventoryData
    ? inventoryData.map((inventory) => ({
        ...inventory,
        id: inventory._id,
      }))
    : [];

  useEffect(() => {
    if (inventories) {
      setRows(inventories);
    }
  }, [inventories]);

  const handleEditClick = (item) => {
    setEditItem(item);
    setNewReorderLevel(item.reorderLevel.toString());
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditItem(null);
    setNewReorderLevel('');
  };

  const handleReorderLevelUpdate = async () => {
    if (!editItem || !newReorderLevel) return;
    try {
      if (newReorderLevel == 0) {
        toast.error('Failed to update reorder level');
      } else {
        const result = await updateReorderLevel({
          productName: editItem.productName,
          reorderLevel: parseInt(newReorderLevel),
        }).unwrap();

        console.log('Update result:', result);

        // Refetch the inventory data
        await refetch();

        toast.success('Reorder Level updated successfully');
      }
      // Close the dialog
      handleEditClose();
    } catch (err) {
      toast.error('Failed to update reorder level');
      console.error(
        `Failed to update reorder level:, ${err.message || 'Unknown error'}`
      );
    }
  };

  const columns = [
    { field: 'productName', headerName: 'Product Name', flex: 1.5, Width: 150 },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      flex: 0.8,
      Width: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'unit',
      headerName: 'Unit',
      Width: 25,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'reorderLevel',
      headerName: 'Reorder Level',
      type: 'number',
      flex: 1,
      Width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      width: 150,
      cellClassName: 'actions',
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label='Edit'
          color='primary'
          onClick={() => handleEditClick(row)}
        />,
      ],
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box sx={{ height: '70vh', width: '100%', p: 2 }}>
      <Typography variant='h5'>Inventory List</Typography>
      <br />
      <DataGrid
        rows={inventories}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortingModel={sortModel}
        onSortingModelChange={setSortModel}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        autoPageSize
        {...inventories}
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
      />
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Reorder Level</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='New Reorder Level'
            type='number'
            fullWidth
            value={newReorderLevel}
            onChange={(e) => setNewReorderLevel(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleReorderLevelUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryListScreen;
