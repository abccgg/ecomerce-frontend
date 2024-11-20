import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import { Button, Image, Input } from 'antd'
import  imageLogo from '../../assets/images/logoLog.webp'
import {
    EyeFilled,
    EyeInvisibleFilled
  } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import InputForm from '../../components/InputForm/InputForm';
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'

const SignUpPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()

  const mutation = useMutationHooks(
    data => UserService.signupUser(data)  
    )
  
  const { data, isPending, isSuccess, isError} = mutation

  // useEffect(() =>{
  //   if(isSuccess){
  //     message.success()
  //     handleNavigateSignIn()
  //   }else if(isError){
  //     message.error()
  //   }
  // }, [isSuccess, isError])

  useEffect(() => {
    if (isSuccess && data?.status === 'ok') {
      message.success(data?.message || 'Đăng ký thành công');
      handleNavigateSignIn();
    } else if (isError || data?.status === 'ERR') {
      message.error(data?.message || 'Đăng ký thất bại');
    }
  }, [isSuccess, isError, data]);
  

  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }

  const handleOnchangePassword = (value) => {
    setPassword(value)
  }

  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value)
  }

  const handleSignUp = () => {
    mutation.mutate({
      email, password, confirmPassword
    })
  }

  const handleNavigateSignIn = () => {
    navigate('/sign-in')
  }
    const [iShowPassword, setIsShowPassword] = useState(false)
    const [iShowConfirmPassword, setIsConfirmShowPassword] = useState(false)
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
          <span>Đăng kí tài khoản</span>
          <InputForm placeholder="Gmail" style={{ margin: "10px 0" }} value={email} onChange={handleOnchangeEmail} />

          <div style={{position: 'relative'}}>
            <span 
            onClick={() => setIsShowPassword(!iShowPassword)}
            style={{
                zIndex: 10,
                position: 'absolute',
                top: '10px',
                right: '8px'
            }}>
                {
                    iShowPassword ? (
                        <EyeFilled />
                    ) : (
                        <EyeInvisibleFilled />
                    )
                }
            </span>
            <InputForm placeholder="Password" type={iShowPassword ? "text" : "password"} 
            value={password} onChange={handleOnchangePassword}/>
          </div>

          <div style={{position: 'relative'}}>
            <span 
            onClick={() => setIsConfirmShowPassword(!iShowConfirmPassword)}
            style={{
                zIndex: 10,
                position: 'absolute',
                top: '10px',
                right: '8px'
            }}>
                {
                    iShowConfirmPassword ? (
                        <EyeFilled />
                    ) : (
                        <EyeInvisibleFilled />
                    )
                }
            </span>
            <InputForm placeholder="ConfirmPassword" type={iShowConfirmPassword ? "text" : "password"} 
            value={confirmPassword} onChange={handleOnchangeConfirmPassword}/>
          </div>
          {data?.status === "ERR" && (<span style={{ color: "red" }}>{data?.message}</span>)}
          <Loading isPending={isPending}>
          <Button
          onClick={handleSignUp}
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
            Đăng kí
          </Button>
          </Loading>
          <p>
            Đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn} style={{cursor: 'pointer'}}> Đăng nhập</WrapperTextLight>
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
  )
}

export default SignUpPage