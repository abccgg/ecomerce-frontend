import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Input, Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { useSelector } from 'react-redux';
import { useMutationHooks } from '../../hooks/useMutationHook';
import InputComponent from '../InputComponent/InputComponent';
import * as message from "../../components/Message/Message"
import {  DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { getBase64 } from '../../utils';
import * as UserService from "../../services/UserService";
import { useQuery } from '@tanstack/react-query';


const AdminUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const [form] = Form.useForm()
  const [rowSelected, setRowSelected] = useState('')
  const user = useSelector((state)=> state?.user)
  const searchInput = useRef(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)

  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    isAdmin: false,
    avatar: ''
})

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = UserService.updateUser(
        id,
        {...rests},
          token)
      return res
    }
  )

  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id,
        token} = data
      const res = UserService.deleteUser(
        id,
        token)
      return res
    }
  )

  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids} = data
      const res = UserService.deleteManyUser(
        ids,
        token)
      return res
    }
  )

  const handleDeleteManyUsers = (ids) => {
    mutationDeletedMany.mutate({ids: ids, token: user?.access_token}, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token)
    return res
  }



  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected)
    if(res?.data){
      setStateUserDetails({
      name: res?.data?.name,
      email: res?.data?.email,
      address: res?.data?.address,
      phone: res?.data?.phone,
      avatar: res?.data?.avatar,
      isAdmin: res?.data?.isAdmin
      })
    }
  }

  useEffect(()=>{
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(()=>{
    if(rowSelected && isOpenDrawer){
      fetchGetDetailsUser(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])

  const handleDetailsProduct = () => {  
    setIsOpenDrawer(true)
  }

  const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated} = mutationUpdate
  const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted} = mutationDeleted
  const { data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany} = mutationDeletedMany

  const queryUser = useQuery({queryKey:['users'], queryFn: getAllUsers})
  const {data: users} = queryUser


  const renderAction = () => {
    return (
      <div>
            <DeleteOutlined  style={{color: 'red', fontSize: 25, cursor: 'pointer'}} onClick={ ()=> setIsModalOpenDelete(true)}/>
            <EditOutlined style={{color: 'pink', fontSize: 25, cursor: 'pointer'}}  onClick={handleDetailsProduct}/>

      </div>
      
    )
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps('email')
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address')
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Admin',
      dataIndex: 'isAdmin',
      filters: [
        {
          text: 'True',
          value: true
        },
        {
          text: 'False',
          value: false
        }
      ],
    },
   
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];


  const dataTable = users?.data?.length && users?.data?.map((user)=> {
    return{...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE'}
  })


  useEffect(()=>{
    if(isSuccessDeleted && dataDeleted?.status === 'ok'){
      message.success()
      handleCancelDelete()
    }else if(isErrorDeleted){
      message.error()
    }
  }, [isSuccessDeleted])

  useEffect(()=>{
    if(isSuccessDeletedMany && dataDeletedMany?.status === 'ok'){
      message.success()
    }else if(isErrorDeletedMany){
      message.error()
    }
  }, [isSuccessDeletedMany])

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: '',
      email: '',
      address: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
  };

  useEffect(()=>{
    if(isSuccessUpdated && dataUpdated?.status === 'ok'){
      message.success()
      handleCloseDrawer()
    }else if(isErrorUpdated){
      message.error()
    }
  }, [isSuccessUpdated])

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const handleDeleteUser = ()=> {
    mutationDeleted.mutate({id: rowSelected, token: user?.access_token}, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

    const onUpdateUser = () => {
       mutationUpdate.mutate({id: rowSelected, token: user?.accessToken, ...stateUserDetails},{
        onSettled: () => {
          queryUser.refetch()
        }
       })
    }


    const handleOnChangeDetails = (e) => {
      setStateUserDetails({
          ...stateUserDetails,
          [e.target.name]: e.target.value
      })
    };

  const handleOnchangeAvatarDetails = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj );
      }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview
    })
}




  return (
    <div>
  <WrapperHeader>Quản lý người dùng</WrapperHeader>
  
      <div style={{ marginTop: 20 }}>
        <TableComponent handleDeleteMany={handleDeleteManyUsers} columns={columns} data={dataTable}
        onRow={(record, rowIndex)=>{
          return{
            onClick: event => {
              setRowSelected(record._id)
            }
          }
        }}
        />

        <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose= {()=>setIsOpenDrawer(false)} width = "50%">
        <Form
    name="basic"
    labelCol={{ span: 6 }}
    wrapperCol={{ span: 18 }}
    onFinish={onUpdateUser}
    autoComplete="on"
    form={form}
  >
    <Form.Item
      label="Name"
      name="name"
      rules={[{ required: true, message: 'Please input your Name!' }]}
    >
      <Input  value={stateUserDetails.name} onChange={handleOnChangeDetails} name='name'/>
    </Form.Item>

    <Form.Item
      label="Email"
      name="email"
      rules={[{ required: true, message: 'Please input your email!' }]}
    >
      <Input value={stateUserDetails.email} onChange={handleOnChangeDetails} name='email'/>
    </Form.Item>

    <Form.Item
      label="Address"
      name="address"
      rules={[{ required: true, message: 'Please input your address!' }]}
    >
      <Input value={stateUserDetails.address} onChange={handleOnChangeDetails} name='address'/>
    </Form.Item>

    <Form.Item
      label="Phone number"
      name="phone"
      rules={[{ required: true, message: 'Please input your phone!' }]}
    >
      <Input value={stateUserDetails.phone} onChange={handleOnChangeDetails} name='phone'/>
    </Form.Item>

     <Form.Item
      label="Avatar"
      name="avatar"
      rules={[{ required: true, message: 'Please input your image!' }]}
    >
      <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                    <Button>Select File</Button>
                    {stateUserDetails?.avatar && (
                    <img src={stateUserDetails?.avatar} style={{
                        height: 60,
                        width: 60,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginLeft: 10
                    }} alt="avatar" />
                )}  
                </WrapperUploadFile>
    </Form.Item> 

    <Form.Item wrapperCol={{offset: 11, span: 20}}>
      <Button type="primary" htmlType="submit">
        Thay đổi
      </Button>
    </Form.Item>
          </Form>
        </DrawerComponent>
        
        <ModalComponent
          forceRender
          title="Xóa người dùng"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk= {handleDeleteUser}
        >
          <div>Bạn có chắc muốn xóa tài khoản này không?</div>

        </ModalComponent>

      </div>
    
    </div>
  )
}

export default AdminUser