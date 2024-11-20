
import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDisscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style';
import {StarFilled} from  '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { convertPrice } from '../../utils';

const CardComponent = (props) => {
  const  {countInStock, description, image, name, price, rating, type, discount, selled, id} = props
  const navigate = useNavigate()
  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`)
  }

  return (
    <WrapperCardStyle
      hoverable
      style={{ width: 200, padding: "10px" }}
      cover={ 
        <img
          alt="example"
          src={image}
        />
      } 
      onClick={()=> handleDetailsProduct(id)}

    >
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span style={{marginRight: '4px'}}>
          <span> {rating} </span>{" "}
          <StarFilled style={{ fontSize: "12px", color: "orange" }} />
        </span>
        <WrapperStyleTextSell> | Da ban {selled || 50} </WrapperStyleTextSell>
      </WrapperReportText>
     <WrapperPriceText> 
      <span style={{ marginRight: '8px'}}>{convertPrice(price)} </span>
      <WrapperDisscountText>
        - {discount || 8}%
      </WrapperDisscountText>
     </WrapperPriceText>
    </WrapperCardStyle>
  );
}


export default CardComponent