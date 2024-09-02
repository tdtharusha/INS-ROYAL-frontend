import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store.js';
import { Provider } from 'react-redux';
import PrivateRoute from './components/PrivateRoute.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import SideBarLayout from './components/SideBarLayout.jsx';
import AdminDashboard from './screens/AdminDashboard.jsx';
import UsersListScreen from './screens/user/UsersListScreen.jsx';
import UsersEditScreen from './screens/user/UsersEditScreen.jsx';
import ProductsScreen from './screens/product/ProductsScreen.jsx';
import ProductsListScreen from './screens/product/ProductsListScreen.jsx';
import ProductsEditScreen from './screens/product/ProductsEditScreen.jsx';
import ProductCreateScreen from './screens/product/ProductCreatesScreen.jsx';
import BrandListScreen from './screens/brand/BrandListScreen.jsx';
import BrandRegisterScreen from './screens/brand/BrandRegisterScreen.jsx';
import BrandEditScreen from './screens/brand/BrandEditScreen.jsx';
import SupplierListScreen from './screens/supplier/supplierListScreen.jsx';
import SupplierRegisterScreen from './screens/supplier/supplierRegisterScreen.jsx';
import SupplierEditScreen from './screens/supplier/supplierEditScreen.jsx';
import GRNListScreen from './screens/grn/GRNListScreen.jsx';
import GRNCreateScreen from './screens/grn/GRNCreateScreen.jsx';
import GRNEditScreen from './screens/grn/GRNEditScreen.jsx';
import InventoryListScreen from './screens/inventory/preMadeFoods/InventoryListScreen.jsx';
import MaterialsInventoryScreen from './screens/inventory/materials/MaterialsInventoryScreen.jsx';
import InHouseFoodsInventoryScreen from './screens/inventory/inHouseMadeFoods/InHouseFoodsInventoryScreen.jsx';
import RecipeListScreen from './screens/recipe/RecipeListScreen.jsx';
import RecipeCreateScreen from './screens/recipe/RecipeCreateScreen.jsx';
import RecipeEditScreen from './screens/recipe/RecipeEditScreen.jsx';
import DailyProductScreen from './screens/dailyProduct/DailyProductScreen.jsx';
// import DailyProductAddScreen from './screens/dailyProduct/DailyProductAddScreen.jsx';
// import DailyProductEditScreen from './screens/dailyProduct/DailyProductEditScreen.jsx';
import ProductOverviewScreen from './screens/product/ProductOverviewScreen..jsx';
import OrderListScreen from './screens/order/OrederListSceen.jsx';
import OrderSummaryScreen from './screens/order/OrderSummaryScreen.jsx';
import ShoppingCartScreen from './screens/shoppingCart/ShoppingCartScreen.jsx';
import CheckoutScreen from './screens/checkout/CheckoutScreen.jsx';
import ReportScreen from './screens/report/ReportScreen.jsx';
import NotificationListScreen from './screens/notification screens/NotificationListScreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />

      {/* Private Routes */}
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfileScreen />} />
        <Route
          path='/product/:id/overview'
          element={<ProductOverviewScreen />}
        />
        <Route path='/shoppingcart' element={<ShoppingCartScreen />} />
        <Route path='/checkout' element={<CheckoutScreen />} />
        <Route
          path='/order-summary/:orderId'
          element={<OrderSummaryScreen />}
        />
      </Route>

      {/* Admin Routes */}
      <Route element={<PrivateRoute isAdminRoute={true} />}>
        <Route element={<SideBarLayout />}>
          <Route path='/summary' element={<AdminDashboard />} />
          <Route path='/dashboard' element={<AdminDashboard />} />
          <Route path='users-list' element={<UsersListScreen />} />
          <Route path='user/:id/edit' element={<UsersEditScreen />} />
          <Route path='product/:id' element={<ProductsScreen />} />
          <Route path='/products-list' element={<ProductsListScreen />} />
          <Route path='/product/:id/edit' element={<ProductsEditScreen />} />
          <Route
            path='/product/createproduct'
            element={<ProductCreateScreen />}
          />

          <Route path='/brands' element={<BrandListScreen />} />
          <Route path='/registerbrand' element={<BrandRegisterScreen />} />
          <Route path='/brands/:id/edit' element={<BrandEditScreen />} />
          <Route path='/suppliers' element={<SupplierListScreen />} />
          <Route
            path='/registersupplier'
            element={<SupplierRegisterScreen />}
          />
          <Route path='/suppliers/:id/edit' element={<SupplierEditScreen />} />
          <Route path='/grns' element={<GRNListScreen />} />
          <Route path='/grn/createGRN' element={<GRNCreateScreen />} />
          <Route path='/grn/:id/edit' element={<GRNEditScreen />} />
          <Route
            path='/pre-made-foods-inventory'
            element={<InventoryListScreen />}
          />
          <Route path='/materials' element={<MaterialsInventoryScreen />} />
          <Route
            path='/in-house-foods-inventory'
            element={<InHouseFoodsInventoryScreen />}
          />
          <Route path='/recipes' element={<RecipeListScreen />} />
          <Route path='/createrecipe' element={<RecipeCreateScreen />} />
          <Route path='/recipes/:id/edit' element={<RecipeEditScreen />} />
          <Route path='/dailyProducts' element={<DailyProductScreen />} />
          {/* <Route
            path='/dailyProducts/:id/edit'
            element={<DailyProductEditScreen />}
          /> */}
          {/* <Route path='/dailyProductsadd' element={<DailyProductAddScreen />} /> */}

          <Route path='/orders' element={<OrderListScreen />} />
          <Route path='/reports' element={<ReportScreen />} />
          <Route path='/notifications' element={<NotificationListScreen />} />
        </Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
