import { Input } from 'antd'
import React from 'react'

const InputComponent = ({ size, placeholder, ...rests}) => {
  return (
    <Input
    style={{ border: "none", borderRadius: "0" }}
    size={size}
    placeholder={placeholder}
    {...rests}
  />
  )
}

export default InputComponent