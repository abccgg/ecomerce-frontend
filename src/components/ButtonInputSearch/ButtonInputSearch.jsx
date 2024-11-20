
import React from 'react'
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import { Button } from 'antd';

const ButtonInputSearch = (props) => {
    const {size, placeholder, textbutton, backgroundColorButton= 'rgb(13, 92, 182)'} = props
  return (
    <div style={{ display: "flex" }}>
      <InputComponent
        style={{ border: "none", borderRadius: "0" }}
        size={size}
        placeholder={placeholder}
        {...props}
      />
      <Button
        style={{
          border: "none",
          color: '#fff',
          borderRadius: "0",
          background: backgroundColorButton,
        }}
        size={size}
        icon={<SearchOutlined style={{color: '#fff'}} />}
      >
        {textbutton}
      </Button>
    </div>
  );
}

export default ButtonInputSearch