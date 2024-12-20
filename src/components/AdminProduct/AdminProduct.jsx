import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Input, Select, Space } from 'antd'
import {  DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import TableComponent from "../TableComponent/TableComponent";
import { WrapperUploadFile } from '../../pages/Profile/style';
import { getBase64, renderOptions } from '../../utils'
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message"
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { useSelector } from 'react-redux';
import ModalComponent from '../ModalComponent/ModalComponent';
import InputComponent from '../InputComponent/InputComponent';


const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [form] = Form.useForm()
    const [rowSelected, setRowSelected] = useState('')
    const user = useSelector((state)=> state?.user)
    const searchInput = useRef(null);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const inittial = ()=> ({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',
      type: '',
      countInStock: '',
      newType: '',
      discount: ''
    })
    const [stateProduct, setStateProduct] = useState(inittial())

    const [stateProductDetails, setStateProductDetails] = useState(inittial())

    const mutation = useMutationHooks(
      (data) => {
        const { name,
          price,
          description,
          rating,
          image,
          type,
          countInStock, discount } = data
        const res = ProductService.createProduct({
          name,
          price,
          description,
          rating,
          image,
          type,
          countInStock,
          discount
        })
        return res
      }
    )

    const mutationUpdate = useMutationHooks(
      (data) => {
        const { id,
          token,
          ...rests } = data
        const res = ProductService.updateProduct(
          id,
          token,
          {...rests})
        return res
      }
    )

    const mutationDeleted = useMutationHooks(
      (data) => {
        const { id,
          token} = data
        const res = ProductService.deleteProduct(
          id,
          token)
        return res
      }
    )

    const mutationDeletedMany = useMutationHooks(
      (data) => {
        const { token, ...ids} = data
        const res = ProductService.deleteManyProduct(
          ids,
          token)
        return res
      }
    )

    const getAllProducts = async () => {
      const res = await ProductService.getAllProduct()
      return res
    }

    const fetchGetDetailsProduct = async (rowSelected) => {
      const res = await ProductService.getDetailsProduct(rowSelected)
      if(res?.data){
        setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount
        })
      }
    }

    useEffect(()=>{
      if(!isModalOpen){
        form.setFieldsValue(stateProductDetails)
      }else{
        form.setFieldsValue(inittial())
      }
    }, [form, stateProductDetails, isModalOpen])

    useEffect(()=>{
      if(rowSelected && isOpenDrawer){
        fetchGetDetailsProduct(rowSelected)
      }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsProduct = () => {  
      setIsOpenDrawer(true)
    }

    const handleDeleteManyProducts = (ids) => {
      mutationDeletedMany.mutate({ids: ids, token: user?.access_token}, {
        onSettled: () => {
          setRowSelected('');
          queryProduct.refetch()
        }
      })
    }

    const fetchAllTypeProduct = async () => {
      const res = await ProductService.getAllTypeProduct()
      return res
    } 

    const { data, isSuccess, isError} = mutation
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated} = mutationUpdate
    const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted} = mutationDeleted
    const { data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany} = mutationDeletedMany

    const queryProduct = useQuery({queryKey:['products'], queryFn: getAllProducts})
    const typeProduct = useQuery({queryKey:['type-product'], queryFn: fetchAllTypeProduct})
    const {data: products} = queryProduct
  
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
        title: 'Price',
        dataIndex: 'price',
        sorter: (a, b) => a.price - b.price,
        filters: [
          {
            text: '>= 50',
            value: '>=',
          },
          {
            text: '<= 50',
            value: '<=',
          }
        ],
        onFilter: (value, record) => {
          if (value === '>=') {
            return record.price >= 50
          }
          return record.price <= 50
        },
      },
      {
        title: 'Rating',
        dataIndex: 'rating',
        sorter: (a, b) => a.rating - b.rating,
        filters: [
          {
            text: '>= 3',
            value: '>=',
          },
          {
            text: '<= 3',
            value: '<=',
          }
        ],
        onFilter: (value, record) => {
          if (value === '>=') {
            return Number(record.rating) >= 3
          }
          return Number(record.rating) <= 3
        },
      },
      {
        title: 'Type',
        dataIndex: 'type',
        sorter: (a, b) => a.type - b.type
      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: renderAction
      },
    ];
    const dataTable = products?.data?.length && products?.data?.map((product)=> {
      return{...product, key: product._id}
    })



    useEffect(()=>{
      if(isSuccess && data?.status === 'ok'){
        message.success()
        handleCancel()
      } else if(isError){
        message.error()
      }
    }, [isSuccess])

    useEffect(()=>{
      if(isSuccessDeletedMany && dataDeletedMany?.status === 'ok'){
        message.success()
      }else if(isErrorDeletedMany){
        message.error()
      }
    }, [isSuccessDeletedMany])

    useEffect(()=>{
      if(isSuccessDeleted && dataDeleted?.status === 'ok'){
        message.success()
        handleCancelDelete()
      }
    }, [isSuccessDeleted])

    const handleCloseDrawer = () => {
      setIsOpenDrawer(false);
      setStateProductDetails({
        name: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        type: '',
        countInStock: ''
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

    const handleDeleteProduct = ()=> {
      mutationDeleted.mutate({id: rowSelected, token: user?.access_token}, {
        onSettled: () => {
          setRowSelected('');
          queryProduct.refetch()
        }
      })
    }


      const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
          name: '',
          price: '',
          description: '',
          rating: '',
          image: '',
          type: '',
          countInStock: '',
          discount: ''
        })
        form.resetFields()
      };

      const onFinish = () => {
        const params = {
          name: stateProduct.name,
          price: stateProduct.price,
          description: stateProduct.description,
          rating: stateProduct.rating,
          image: stateProduct.image,
          type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
          countInStock: stateProduct.countInStock,
          discount: stateProduct.discount
      }
        mutation.mutate(params, {
          onSuccess: () => {
            message.success('Product created successfully!');
            handleCancel();
            queryProduct.refetch();
          },
          onError: () => {
            message.error('Failed to create product.');
          },
        });
      };

      const onUpdateProduct = () => {
         mutationUpdate.mutate({id: rowSelected, token: user?.accessToken, ...stateProductDetails},{
          onSettled: () => {
            queryProduct.refetch()
          }
         })
      }

      const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
      };

      const handleOnChangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })
      };

      const handleOnchangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj );
          }
        setStateProduct({
          ...stateProduct,
          image: file.preview
        })
    }

    const handleOnchangeAvatarDetails = async ({fileList}) => {
      const file = fileList[0]
      if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj );
        }
      setStateProductDetails({
        ...stateProductDetails,
        image: file.preview
      })
  }

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value
    })
}

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{ marginTop: 10 }}>
        <Button style={{ height: 150, width: 150 }} onClick={()=> setIsModalOpen(true)}>
          <PlusOutlined style={{ fontSize: 60 }} />
        </Button>
      </div>
      <div style={{ marginTop: 20 }}>
        <TableComponent handleDeleteMany={handleDeleteManyProducts} columns={columns} data={dataTable}
        onRow={(record, rowIndex)=>{
          return{
            onClick: event => {
              setRowSelected(record._id)
            }
          }
        }}
        />

        <ModalComponent
          forceRender
          title="Tạo sản phẩm"
          open={isModalOpen}
          onCancel={handleCancel}
          footer= {null}
        >
          <Form
    name="basic"
    labelCol={{ span: 6 }}
    wrapperCol={{ span: 18 }}
    onFinish={onFinish}
    autoComplete="on"
    form={form}
  >
    <Form.Item
      label="Name"
      name="name"
      rules={[{ required: true, message: 'Please input your Name!' }]}
    >
      <Input  value={stateProduct.name} onChange={handleOnChange} name='name'/>
    </Form.Item>

    <Form.Item
      label="Type"
      name="type"
      rules={[{ required: true, message: 'Please input your Type!' }]}
    >
      <Select
                name="type"
                // defaultValue="lucy"
                // style={{ width: 120 }}
                value={stateProduct.type}
                onChange={handleChangeSelect}
                options={renderOptions(typeProduct?.data?.data)}
                />
    </Form.Item>
    {stateProduct.type === 'add_type' && (
              <Form.Item
                label='New type'
                name="newType"
                rules={[{ required: true, message: 'Please input your type!' }]}
              >
                <Input value={stateProduct.newType} onChange={handleOnChange} name="newType" />
              </Form.Item>
            )}

    <Form.Item
      label="Count In Stock"
      name="countInStock"
      rules={[{ required: true, message: 'Please input your Count In Stock!' }]}
    >
      <Input value={stateProduct.countInStock} onChange={handleOnChange} name='countInStock'/>
    </Form.Item>

    <Form.Item
      label="Price"
      name="price"
      rules={[{ required: true, message: 'Please input your Price!' }]}
    >
      <Input value={stateProduct.price} onChange={handleOnChange} name='price'/>
    </Form.Item>

    <Form.Item
      label="Description"
      name="description"
      rules={[{ required: true, message: 'Please input your Description!' }]}
    >
      <Input value={stateProduct.description} onChange={handleOnChange} name='description'/>
    </Form.Item>

    <Form.Item
      label="Rating"
      name="rating"
      rules={[{ required: true, message: 'Please input your Rating!' }]}
    >
      <Input value={stateProduct.rating} onChange={handleOnChange} name='rating'/>
    </Form.Item>

    <Form.Item
      label="Discount"
      name="discount"
      rules={[{ required: true, message: 'Please input your discount of product!' }]}
    >
      <Input value={stateProduct.discount} onChange={handleOnChange} name='discount'/>
    </Form.Item>

    <Form.Item
      label="Image"
      name="image"
      rules={[{ required: true, message: 'Please input your image!' }]}
    >
      <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                    <Button>Select File</Button>
                    {stateProduct?.image && (
                    <img src={stateProduct?.image} style={{
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
        Tạo
      </Button>
    </Form.Item>
          </Form>

        </ModalComponent>

        <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose= {()=>setIsOpenDrawer(false)} width = "50%">
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onUpdateProduct}
          autoComplete="on"
          form={form}
  >
    <Form.Item
      label="Name"
      name="name"
      rules={[{ required: true, message: 'Please input your Name!' }]}
    >
      <Input  value={stateProductDetails.name} onChange={handleOnChangeDetails} name='name'/>
    </Form.Item>

    <Form.Item
      label="Type"
      name="type"
      rules={[{ required: true, message: 'Please input your Type!' }]}
    >
      <Input value={stateProductDetails.type} onChange={handleOnChangeDetails} name='type'/>
    </Form.Item>

    <Form.Item
      label="Count In Stock"
      name="countInStock"
      rules={[{ required: true, message: 'Please input your Count In Stock!' }]}
    >
      <Input value={stateProductDetails.countInStock} onChange={handleOnChangeDetails} name='countInStock'/>
    </Form.Item>

    <Form.Item
      label="Price"
      name="price"
      rules={[{ required: true, message: 'Please input your Price!' }]}
    >
      <Input value={stateProductDetails.price} onChange={handleOnChangeDetails} name='price'/>
    </Form.Item>

    <Form.Item
      label="Description"
      name="description"
      rules={[{ required: true, message: 'Please input your Description!' }]}
    >
      <Input value={stateProductDetails.description} onChange={handleOnChangeDetails} name='description'/>
    </Form.Item>

    <Form.Item
      label="Rating"
      name="rating"
      rules={[{ required: true, message: 'Please input your Rating!' }]}
    >
      <Input value={stateProductDetails.rating} onChange={handleOnChangeDetails} name='rating'/>
    </Form.Item>

    <Form.Item
      label="Discount"
      name="discount"
      rules={[{ required: true, message: 'Please input your discount of product!' }]}
    >
      <Input value={stateProductDetails.discount} onChange={handleOnChangeDetails} name='discount'/>
    </Form.Item>

    <Form.Item
      label="Image"
      name="image"
      rules={[{ required: true, message: 'Please input your image!' }]}
    >
      <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                    <Button>Select File</Button>
                    {stateProductDetails?.image && (
                    <img src={stateProductDetails?.image} style={{
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
          title="Xóa sản phẩm"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk= {handleDeleteProduct}
        >
          <div>Bạn có chắc muốn xóa sản phẩm này không?</div>

        </ModalComponent>

      </div>
    </div>
  );
};

export default AdminProduct