import React, { useState } from 'react';
import {
  useGetRecipesQuery,
  useDeleteRecipeMutation,
} from '../../slices/recipe/recipeApiSlice';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Button,
  Box,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RecipeListScreen = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [deleteRecipe] = useDeleteRecipeMutation();

  const [paginationModel, setPaginationModel] = useState();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  const { data: recipesData, error, isLoading } = useGetRecipesQuery();

  const recipes = recipesData
    ? recipesData.map((recipe) => ({
        ...recipe,
        id: recipe._id,
      }))
    : [];

  const handleEdit = (id) => {
    navigate(`/recipes/${id}/edit`);
  };

  const handleAddNew = () => {
    navigate('/createrecipe');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe(id).unwrap();
        toast.success('Recipe deleted successfully');
      } catch (err) {
        toast.error('Failed to delete the supplier', err);
      }
    }
  };

  const handleOpenIngredients = (ingredients) => {
    setSelectedIngredients(ingredients);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const columns = [
    {
      field: 'productName',
      headerName: 'Product Name',
      flex: 1,
      width: 200,
      sortable: true,
    },
    {
      field: 'brand',
      headerName: 'Brand',
      flex: 1,
      width: 200,
      sortable: true,
      renderCell: (params) => params.value.name,
    },
    {
      field: 'subSection',
      headerName: 'Sub Section',
      flex: 1,
      width: 200,
      sortable: true,
    },
    {
      field: 'ingredients',
      headerName: 'Ingredients',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant='text'
          onClick={() => handleOpenIngredients(params.row.ingredients)}
        >
          View Ingredients
        </Button>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <strong>
          <Tooltip title='Edit'>
            <IconButton color='primary' onClick={() => handleEdit(params.id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
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
  if (error)
    return <Typography color='error'>Error loading suppliers</Typography>;

  return (
    <Box sx={{ height: '70vh', width: '100%', p: 2 }}>
      <Typography variant='h5'>Recipes List</Typography>
      <br />
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
          onClick={handleAddNew}
        >
          Creare New Recipe
        </Button>
      </Box>
      <Paper elevation={3} sx={{ height: '50vh', width: '100%' }}>
        <DataGrid
          rows={recipes}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortingModel={sortModel}
          onSortingModelChange={setSortModel}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          autoPageSize
          {...recipes}
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
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Ingredients</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {selectedIngredients.map((ingredient, index) => (
                <Box
                  key={index}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    padding: '8px',
                    minWidth: '150px',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant='subtitle1'>{ingredient.name}</Typography>
                  <Typography variant='body2' color='textSecondary'>
                    {`${ingredient.quantity} ${ingredient.unit}`}
                  </Typography>
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color='primary'>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default RecipeListScreen;
