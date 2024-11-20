import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import InputForm from '../../components/InputForm/InputForm'
import { Button, Upload } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { UploadOutlined} from '@ant-design/icons'
import { getBase64 } from '../../utils'


const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [ email, setEmail] = useState('')
    const [ name, setName] = useState('')
    const [ phone, setPhone] = useState('')
    const [ address, setAddress] = useState('')
    const [ avatar, setAvatar] = useState('')


    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests} = data
            UserService.updateUser(id, rests, access_token) 
        }
        )

    const dispatch = useDispatch()
      const { data, isPending, isSuccess, isError} = mutation

    useEffect(()=>{
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])

    useEffect(()=>{
        if(isSuccess){
            handleGetDetailsUser(user?.id, user?.access_token)
        }else if(isError){
            message.error()
        }
    }, [isSuccess, isError])


    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token);
        dispatch(updateUser({...res?.data, access_token: token}))
  };

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangeName = (value) => {
        setName(value)
    }
    const handleOnchangePhone = (value) => {
        setPhone(value)
    }
    const handleOnchangeAddress = (value) => {
        setAddress(value)
    }
    const handleOnchangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj );
          }
        setAvatar(file.preview)
    }

    const handleUpdate = () => {
        mutation.mutate({id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token})
    
    }
    
  return (
    <div style={{width: 1270, margin: '0 auto', height: 600}}>
        <WrapperHeader>Thông tin người dùng</WrapperHeader>
        <WrapperContentProfile>

            <WrapperInput>
                <WrapperLabel htmlFor='name'>Name</WrapperLabel>
                <InputForm
                id='name'
                style={{width: 300}}
                value={name}
                onChange={handleOnchangeName}
                />
                <Button
              onClick={handleUpdate}
              style={{
                height: 30,
                width: "fit-content",
                borderRadius: "4px",
                color: "rgb(26, 148, 255)",
                fontSize: '15px',
                fontWeight: 700,
                padding: "6px 6px 6px",
              }}
            >
              Cập nhật
            </Button>
            </WrapperInput>

            <WrapperInput>
                <WrapperLabel htmlFor='email'>Email</WrapperLabel>
                <InputForm
                id='email'
                style={{width: 300}}
                value={email}
                onChange={handleOnchangeEmail}
                />
                <Button
              onClick={handleUpdate}
              style={{
                height: 30,
                width: "fit-content",
                borderRadius: "4px",
                color: "rgb(26, 148, 255)",
                fontSize: '15px',
                fontWeight: 700,
                padding: "6px 6px 6px",
              }}
            >
              Cập nhật
            </Button>
            </WrapperInput>

            <WrapperInput>
                <WrapperLabel htmlFor='phone'>Phone</WrapperLabel>
                <InputForm
                id='phone'
                style={{width: 300}}
                value={phone}
                onChange={handleOnchangePhone}
                />
                <Button
              onClick={handleUpdate}
              style={{
                height: 30,
                width: "fit-content",
                borderRadius: "4px",
                color: "rgb(26, 148, 255)",
                fontSize: '15px',
                fontWeight: 700,
                padding: "6px 6px 6px",
              }}
            >
              Cập nhật
            </Button>
            </WrapperInput>

            <WrapperInput>
                <WrapperLabel htmlFor='address'>Address</WrapperLabel>
                <InputForm
                id='address'
                style={{width: 300}}
                value={address}
                onChange={handleOnchangeAddress}
                />
                <Button
              onClick={handleUpdate}
              style={{
                height: 30,
                width: "fit-content",
                borderRadius: "4px",
                color: "rgb(26, 148, 255)",
                fontSize: '15px',
                fontWeight: 700,
                padding: "6px 6px 6px",
              }}
            >

              Cập nhật
            </Button>
            </WrapperInput>

            <WrapperInput>
                <WrapperLabel htmlFor='avatar'>Avatar</WrapperLabel>
                <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                </WrapperUploadFile>
                {avatar && (
                    <img src={avatar} style={{
                        height: 60,
                        width: 60,
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }} alt="avatar" />
                )}                
                <Button
              onClick={handleUpdate}
              style={{
                height: 30,
                width: "fit-content",
                borderRadius: "4px",
                color: "rgb(26, 148, 255)",
                fontSize: '15px',
                fontWeight: 700,
                padding: "6px 6px 6px",
              }}
            >
              Cập nhật
            </Button>
            </WrapperInput>

        
        </WrapperContentProfile>
    </div>
  )
}

export default ProfilePage