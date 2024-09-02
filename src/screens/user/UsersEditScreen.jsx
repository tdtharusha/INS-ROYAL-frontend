import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from '../../slices/user/userApiSlice';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
//import { setCredentials } from '../slices/authSlice';

const UsersEditScreen = () => {
  const { id } = useParams();
  //console.log(id);
  const navigate = useNavigate();
  //const dispatch = useDispatch();

  //const { userInfo } = useSelector((state) => state.auth);

  const { data: user, isLoading, isError, refetch } = useGetUserByIdQuery(id);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isAdmin: false,
    category: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        category: user.category,
      });
    }
  }, [user]);
  // console.log('user :', user);

  const handleChange = (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    console.log('updating user', value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateUser({ id, user: formData }).unwrap();
      toast.success('User update successfully');
      refetch();
      navigate('/users-list');
      console.log('updated user', result);
    } catch (err) {
      toast.error('Failed to Update User');
      console.log('Error updating user', err);
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <div>Error... Loading User</div>;

  return (
    <Paper
      elevation={3}
      style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}
    >
      <Typography variant='h5' gutterBottom>
        Edit User
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='User Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label='User Eamil'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id='category-label'>User Category</InputLabel>
              <Select
                labelId='category-label'
                label='User Category'
                name='category'
                value={formData.category}
                onChange={handleChange}
              >
                <MenuItem value='customer'>Customer</MenuItem>
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='delivery personnel'>
                  Delivery Personnel
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label='is Admnin'
              name='isAdmin'
              value={formData.isAdmin}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name='isAdmin'
                  checked={formData.isAdmin}
                  onChange={handleChange}
                />
              }
              label='Is Admin'
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type='submit'
              variant='contained'
              disabled={isUpdating}
              className='mt-3'
            >
              {isUpdating ? 'Updating...' : 'Update User'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default UsersEditScreen;
