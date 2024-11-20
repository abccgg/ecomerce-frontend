import { Button, Col, Image, Rate, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import smaillImage from '../../assets/images/smallImage.webp'
import { WrapperAddressProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQuantityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import {MinusOutlined, PlusOutlined, StarFilled} from  '@ant-design/icons';
import * as ProductService from "../../services/ProductService";
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide';
import { convertPrice } from '../../utils';
import * as message from '../../components/Message/Message'

const ProductDetailsComponent = ({idProduct}) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state)=>state.user)
    const order = useSelector((state)=>state.order)
    const [errorLimitOrder, setErrorLimitOrder] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const onChange = (value) => {
      setNumProduct(Number(value))
    }

    const fetchGetDetailsProduct = async (context) => {
      const id = context?.queryKey && context?.queryKey[1]
      if(id){
        const res = await ProductService.getDetailsProduct(id)
      return res.data
      }
    }

    useEffect(() => {
      const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id) 
      if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
          setErrorLimitOrder(false)
      } else if(productDetails?.countInStock === 0){
          setErrorLimitOrder(true)
      }
  },[numProduct])

    useEffect(() => {
      if(order.isSucessOrder) {
          message.success('Đã thêm vào giỏ hàng')
      }
      return () => {
          dispatch(resetOrder())
      }
  }, [order.isSucessOrder])
    
  const handleChangeCount = (type, limited) => {
    if(type === 'increase') {
        if(!limited) {
            setNumProduct(numProduct + 1)
        }
    }else {
        if(!limited) {
            setNumProduct(numProduct - 1)
        }
    }
}

    const {isPending, data: productDetails} = useQuery({ queryKey: ['product-details', idProduct], queryFn: fetchGetDetailsProduct, enabled: !!idProduct })

    const handleAddOrderProduct = () => {
      if(!user?.id) {
          navigate('/sign-in', {state: location?.pathname})
      }else {
          // {
          //     name: { type: String, required: true },
          //     amount: { type: Number, required: true },
          //     image: { type: String, required: true },
          //     price: { type: Number, required: true },
          //     product: {
          //         type: mongoose.Schema.Types.ObjectId,
          //         ref: 'Product',
          //         required: true,
          //     },
          // },
          const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
          if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
              dispatch(addOrderProduct({
                  orderItem: {
                      name: productDetails?.name,
                      amount: numProduct,
                      image: productDetails?.image,
                      price: productDetails?.price,
                      product: productDetails?._id,
                      discount: productDetails?.discount,
                      countInstock: productDetails?.countInStock
                  }
              }))
          } else {
              setErrorLimitOrder(true)
          }
      }
  }

  return (
    <Row style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
      <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: 8}}>
        <Image src={productDetails?.image} alt="image product" preview={false} />
        <Row style={{ paddingTop: 10, justifyContent: "space-between" }}>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={smaillImage}
              alt="image small"
              preview={false}
            />
          </WrapperStyleColImage>

          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={smaillImage}
              alt="image small"
              preview={false}
            />
          </WrapperStyleColImage>

          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={smaillImage}
              alt="image small"
              preview={false}
            />
          </WrapperStyleColImage>

          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={smaillImage}
              alt="image small"
              preview={false}
            />
          </WrapperStyleColImage>

          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={smaillImage}
              alt="image small"
              preview={false}
            />
          </WrapperStyleColImage>

          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={smaillImage}
              alt="image small"
              preview={false}
            />
          </WrapperStyleColImage>
        </Row>
      </Col>
      <Col span={14} style={{paddingLeft: 10}}>
        <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
        <div>
          <Rate allowHalf defaultValue={productDetails?.rating}  value={productDetails?.rating}/>
          <WrapperStyleTextSell> | Da ban 898</WrapperStyleTextSell>
        </div>
        <WrapperPriceProduct>
          <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
        </WrapperPriceProduct>
        <WrapperAddressProduct>
          <span>Giao den </span> 
          <span className="address"> {user?.address} </span>
          <span className="change-address"> Doi dia chi</span>
        </WrapperAddressProduct>
        <div style={{margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
          <div style={{marginBottom: 10}}>So luong</div>
          <WrapperQuantityProduct>
            <button style={{ border: "none", background: "transparent", cursor: 'pointer'}} onClick={()=>handleChangeCount('decrease', numProduct ===1)}>
              <MinusOutlined style={{ color: "#000", fontSize: "20" }} />
            </button>
            <WrapperInputNumber onChange={onChange} defaultValue={1} min={1} max={productDetails?.countInStock} value = {numProduct} size='small'></WrapperInputNumber>
            <button style={{ border: "none", background: "transparent", cursor: 'pointer'}} onClick={()=>handleChangeCount('increase', numProduct ===productDetails.countInStock)}>
              <PlusOutlined style={{ color: "#000", fontSize: "20" }} />
            </button>
          </WrapperQuantityProduct>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div>
            <Button style={{
                background: 'rgb(255, 57, 69)',
                height: 48,
                width: 220,
                border: 'none',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
            }}
            onClick={handleAddOrderProduct}
            >
                Chọn mua
            </Button>
            {errorLimitOrder && <div style={{color: 'red'}}>San pham het hang</div>} 
          </div>
            
            <Button style={{
                background: '#fff',
                height: 48,
                width: 220,
                border: '1px solid rgb(13, 92, 182)',
                color: 'rgb(13, 92, 182)',
                fontSize: 15,
            }}>
                Mua trả sau
            </Button>
        </div>
      </Col>
    </Row>
  );
}

export default ProductDetailsComponent