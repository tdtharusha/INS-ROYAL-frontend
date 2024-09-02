import React from 'react';
import { Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ProductOverviewScreen from './ProductOverviewScreen.';

const ProductsScreen = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>Products</h1>
      <ProductOverviewScreen productId={id} />
      <Outlet />
    </div>
  );
};

export default ProductsScreen;
