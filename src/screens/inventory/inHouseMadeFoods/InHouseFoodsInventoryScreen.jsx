import React, { useState, useEffect } from 'react';
import { useGetInHouseInventoryQuery } from '../../../slices/inventory/inHouseFoodsInventory/inHouseMadeFoodApiSllice';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, useTheme, useMediaQuery, Typography } from '@mui/material';

const InHouseFoodsInventoryScreen = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [paginationModel, setPaginationModel] = useState();
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });

  const [rows, setRows] = useState([]);

  const {
    data: inHouseFoodsData,
    error,
    isLoading,
  } = useGetInHouseInventoryQuery();

  const inHouseFoods = inHouseFoodsData
    ? inHouseFoodsData.map((inhouseFood) => ({
        ...inhouseFood,
        id: inhouseFood._id,
      }))
    : [];

  useEffect(() => {
    if (inHouseFoods) {
      setRows(inHouseFoods);
    }
  }, [inHouseFoods]);

  const columns = [
    { field: 'productName', headerName: 'Product Name', flex: 1, Width: 80 },
    {
      field: 'brand',
      headerName: 'Brand',
      flex: 1,
      Width: 80,
      // headerAlign: 'center',
      align: 'left',
      sortable: true,
      renderCell: (params) => params.value.name,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      flex: 1,
      Width: 80,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      Width: 25,
      headerAlign: 'center',
      align: 'center',
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box sx={{ height: '70vh', width: '100%', p: 2 }}>
      <Typography variant='h5'>In-House-Made-Foods Inventory List</Typography>
      <br />
      <DataGrid
        rows={inHouseFoods}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortingModel={sortModel}
        onSortingModelChange={setSortModel}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        autoPageSize
        {...inHouseFoods}
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
    </Box>
  );
};

export default InHouseFoodsInventoryScreen;
