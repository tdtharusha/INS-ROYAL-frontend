import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ isAdminRoute = false }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    // User is not authenticate
    return <Navigate to='/login' replace />;
  }

  if (isAdminRoute && !userInfo.isAdmin) {
    // User is authenticate but not an admin
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
