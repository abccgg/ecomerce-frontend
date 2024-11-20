import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { useParams } from 'react-router-dom'

const ProductDetailsPage = () => {
  const { id } = useParams();
  return (
    <div style={{ width: "100%", background: "#efefef", height: "100%" }}>
      <div style={{ width: '1270px', height: '100%', margin: '0 auto'}} >
        <h1>Chi tiết sản phẩm</h1>
        <ProductDetailsComponent idProduct={id} />
      </div>
    </div>
  );
}

export default ProductDetailsPage