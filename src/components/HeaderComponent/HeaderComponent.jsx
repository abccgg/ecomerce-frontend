import React, { useEffect, useState } from 'react'
import {Badge, Col, Popover } from 'antd'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader } from './style';
import * as UserService from '../../services/UserService'
import {
    CaretDownOutlined,
    ShoppingCartOutlined,
    UserOutlined
  } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser } from '../../redux/slides/userSlide'
import { searchProduct } from '../../redux/slides/productSlide';

const HeaderComponent = ({isHiddenSearch = false, isHiddenCart = false}) => {

   const [userName, setUserName] = useState('')
   const [userAvatar, setUserAvatar] = useState('')
   const [search, setSearch] = useState('')
   const [isOpenPopup, setIsOpenPopup] = useState(false)
   const order = useSelector((state)=> state.order)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const handleLogout = async () =>{
    await UserService.logoutUser()
    dispatch(resetUser())
    navigate('/')
  }
  


useEffect(()=>{
  setUserName(user?.name)
  setUserAvatar(user?.avatar)
}, [user?.name, user?.avatar]) 



 
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }
  const content = (
    <div>
      <WrapperContentPopup onClick={()=> handleClickNavigate('profile')}>Tài khoản</WrapperContentPopup>
      {user?.isAdmin && (
      <WrapperContentPopup onClick={()=> handleClickNavigate('admin')}>Quản lý hệ thống</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={()=> handleClickNavigate('my-order')}>Đơn hàng của tôi</WrapperContentPopup>
      <WrapperContentPopup onClick={()=> handleClickNavigate()}>Đăng xuất</WrapperContentPopup>

    </div>
  )

  const handleClickNavigate = (type)=> {
    if(type ==='profile'){
      navigate('/profile-user')
    }else if(type ==='admin'){
      navigate('/system/admin')
    }else if(type ==='my-order'){
      navigate('/my-order', { state: {
        id: user?.id,
        token: user?.access_token
      }
      })
    }else{
      handleLogout()
    }
    setIsOpenPopup(false)
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }
  return (
    <div
      style={{
        width: "100%",
        background: "rgb(26, 148, 255)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <WrapperHeader style={{justifyContent: isHiddenSearch && isHiddenCart ? 'space-between': 'unset'}}>
        <Col span={5} style={{ alignItems: "center", display: "flex" }}>
          <WrapperTextHeader onClick={()=>{navigate('/')}}>THUONGMAIDIENTU</WrapperTextHeader>
        </Col>
        {!isHiddenSearch  && (
          <Col span={13}>
          <ButtonInputSearch
            textbutton="Tìm Kiếm"
            placeholder="Nhập tên sản phẩm"
            size="large"
            onChange={onSearch}
          />
        </Col>
        )}
        

        <Col
          span={6}
          style={{ display: "flex", gap: "54px", alignItems: "center" }}
        >
          <WrapperHeaderAccount>
            {userAvatar ? ( 
              <img src={userAvatar} alt='avatar' style={{
                height: 30,
                width: 30,
                borderRadius: '50%',
                objectFit: 'cover'
              }}/>
              ) : (
              <UserOutlined style={{ fontSize: "30px" }} />
              )}
            {user?.access_token ? (
              <>
                <Popover content={content} trigger="click" open={isOpenPopup}>
                  <div
                    style={{
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                    onClick={()=>setIsOpenPopup((prev)=>!prev)}
                  >
                    <span>{userName.length ? userName : user?.email}</span>
                  </div>
                </Popover>
              </>
            ) : (
              <div onClick={handleNavigateLogin}>
                <span>Đăng nhập/Đăng kí</span>
                <div>
                  <span>Tài khoản</span>
                  <CaretDownOutlined />
                </div>
              </div>
            )}
          </WrapperHeaderAccount>

              {!isHiddenCart && (
          <div style={{ color: "#fff", cursor: 'pointer' }} onClick={()=> navigate('/order')}>
            <Badge count={order?.orderItems?.length} size="small">
              <ShoppingCartOutlined
                style={{ fontSize: "30px", color: "#fff" }}
              />
            </Badge>
            <span style={{ fontSize: "12px" }}>Giỏ hàng</span>
          </div>
              )}
         
        </Col>
      </WrapperHeader>
    </div>
  );
}

export default HeaderComponent