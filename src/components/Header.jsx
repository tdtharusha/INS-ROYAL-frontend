import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useLogoutMutation } from '../slices/user/userApiSlice';
import { clearCredentials } from '../slices/user/authSlice';
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from './../slices/shoppingCart/shoppingCartApiSlice';
import SearchBox from './SearchBox';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

const Header = ({ onDrawerToggle }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.shoppingCart, shallowEqual);

  // sconsole.log('Cart state:', cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  // const { data: cartData, isLoading, isError } = useGetCartQuery();

  const cartItemsCount = cart.cartItems.length;
  // const cartItemsCount = cart.cartItems.reduce((total, item) => {
  //   return total + (item.newItem ? item.newItem.quantity : 0);
  // }, 0);

  // console.log('Cart items count:', cartItemsCount);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(clearCredentials());
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header>
      <Navbar bg='dark' data-bs-theme='dark' expand='lg' collapseOnSelect>
        <Container>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='menu'
            onClick={onDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <LinkContainer to='/'>
            <Navbar.Brand>INS ROYAL</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <SearchBox />
            <Nav className='ms-auto'>
              <LinkContainer to='/shoppingcart'>
                <Nav.Link>
                  <FaShoppingCart /> {'cart'}
                  {cartItemsCount > 0 && (
                    <Badge pill bg='danger'>
                      {cartItemsCount}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id='username'>
                    {userInfo && userInfo.isAdmin && (
                      <LinkContainer to='/dashboard'>
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                    )}
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    {userInfo && !userInfo.isAdmin && (
                      <LinkContainer to='/user-orders'>
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                    )}
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to='/login'>
                    <Nav.Link>
                      <FaSignInAlt /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/register'>
                    <Nav.Link>
                      <FaSignOutAlt /> Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
export default Header;
