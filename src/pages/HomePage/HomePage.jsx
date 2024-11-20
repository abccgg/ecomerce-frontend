import React, { useEffect, useRef, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/slider1.webp';
import slider2 from '../../assets/images/slider2.webp';
import slider3 from '../../assets/images/slider3.webp';
import CardComponent from '../../components/CardComponent/CardComponent';
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';


const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce  = useDebounce(searchProduct, 1000)
  const [limit, setLimit] = useState(6)
  const [typeProducts, setTypeProducts] = useState([])
  const fetchProductAll = async (context) => {
    const limit = context?.queryKey &&  context?.queryKey[1]
    const search = context?.queryKey &&  context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)

       return res 
  }

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if(res?.status === 'ok') {
      setTypeProducts(res?.data)
    }
  } 

  const {isPending, data: products} = useQuery({ queryKey: ['products', limit, searchDebounce], queryFn: fetchProductAll, retry: 3, retryDelay: 1000 })
  
  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  return (
    <>
      <div style={{ width: 1270, margin: '0 auto' }}>
        <WrapperTypeProduct>
          {typeProducts.map((item) => {
            return <TypeProduct name={item} key={item} />;
          })}
        </WrapperTypeProduct>
      </div>
      <div className='body' style={{width: '100%', backgroundColor: '#efefef'}}>
        <div
          id="container"
          style={{
            backgroundColor: "#efefef",
            width: 1270,
            margin: '0 auto',
            height: "1000px",
          }}
        >
          <SliderComponent arrImages={[slider1, slider2, slider3]} />
          <WrapperProducts>
            {products?.data?.map((product) => {
              return (
                <CardComponent
                  key={product._id}
                  countInStock={product.countInStock}
                  description= {product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  selled= {product.selled}
                  discount= {product.discount}
                  id={product._id}
                />
              )
            })}
          
          </WrapperProducts>
          {/* <NavbarComponent /> */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 10
        }}>
        <WrapperButtonMore
            style={{
              border: "1px solid rgb(11, 116, 229)",
              color: "rgb(11, 116, 229)",
              boderRadius: "4px",
              width: 240,
              height: 38,
              fontWeight: 700,
            }}
            onClick={() => setLimit((prev)=> prev + 6)}
            disabled={products?.total === products?.data?.length || products?.totalPage === 1}
          >
            Xem thêm
          </WrapperButtonMore>
        </div>
        </div>
      </div>
      
    </>
  );
}

export default HomePage