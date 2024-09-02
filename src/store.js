import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authReducer from './slices/user/authSlice';
import brandReducer from './slices/brand/brandSlice';
import productReducer from './slices/product/productSlice';
import supplierReducer from './slices/supplier/supplierSlice';
import grnReducer from './slices/grn/grnSlice';
import preMadeFoodReducer from './slices/inventory/preMadeFoodsInventory/preMadeFoodSlice';
import materialReducer from './slices/inventory/materialsInventory/materialSlice';
import inHouseFoodReducer from './slices/inventory/inHouseFoodsInventory/inHouseMadeFoodSlice';
import recipeReducer from './slices/recipe/recipeSlice';
import dailyProductReducer from './slices/dailyProduct/dailyProductSlice';
import shoppingCartReducer from './slices/shoppingCart/shoppingCartSlice';
import reportReducer from './slices/report/reportSlice';
import notificationReducer from './slices/notificationSlices/notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    brand: brandReducer,
    product: productReducer,
    supplier: supplierReducer,
    grn: grnReducer,
    preMadeFood: preMadeFoodReducer,
    material: materialReducer,
    inHouseMadeFood: inHouseFoodReducer,
    recipe: recipeReducer,
    dailyProduct: dailyProductReducer,
    shoppingCart: shoppingCartReducer,
    report: reportReducer,
    notification: notificationReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
