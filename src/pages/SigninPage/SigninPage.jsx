import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import { Button, Image, Input } from 'antd'
import  imageLogo from '../../assets/images/logoLog.webp'
import * as UserService from '../../services/UserService'
import {
    EyeFilled,
    EyeInvisibleFilled
  } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import InputForm from '../../components/InputForm/InputForm';
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'


const SigninPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const mutation = useMutationHooks(
    data => UserService.loginUser(data)  
    )

  const { data, isPending, isSuccess} = mutation


  useEffect(()=>{
    if(isSuccess && data?.access_token){
      if(location?.state){
        navigate(location?.state)
      }else{
        navigate('/')
      }
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      if(data?.access_token){
        const decoded = jwtDecode(data?.access_token)
        if(decoded?.id){
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }
    }
  }, [isSuccess])

  const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token);
        dispatch(updateUser({...res?.data, access_token: token}))
  };


  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }

  const handleOnchangePassword = (value) => {
    setPassword(value)
  }

  const handleSignIn = () => {
    mutation.mutate({
      email,
      password
    })
  }


  const handleNavigateSignUp = () => {
    navigate('/sign-up')
  }
    const [iShowPassword, setIsShowPassword] = useState(false)
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.53)",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: 800,
          height: 440,
          borderRadius: 25,
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <span>Đăng nhập vào tài khoản</span>
          <InputForm
            placeholder="Gmail"
            style={{ margin: "10px 0 10px" }}
            value={email}
            onChange={handleOnchangeEmail}
          />
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowPassword(!iShowPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "10px",
                right: "8px",
              }}
            >
              {iShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="Password"
              type={iShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
            />
          </div>

          {data?.status === "ERR" && (<span style={{ color: "red" }}>{data?.message}</span>)}
          <Loading isPending={isPending}>
            <Button
              onClick={handleSignIn}
              style={{
                background: "rgb(255, 57, 69)",
                height: 48,
                width: "100%",
                border: "none",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                margin: "26px 0 10px",
              }}
            >
              Đăng nhập
            </Button>
          </Loading>
          <p>
            <WrapperTextLight>Quên mật khẩu</WrapperTextLight>{" "}
          </p>
          <p>
            Chưa có tài khoản{" "}
            <WrapperTextLight onClick={handleNavigateSignUp}>
              Tạo tài khoản
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image
            src={imageLogo}
            preview={false}
            alt="img-logo"
            height={203}
            width={203}
          />
          <h4>Đăng nhập mua sắm thả ga</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
}

export default SigninPage