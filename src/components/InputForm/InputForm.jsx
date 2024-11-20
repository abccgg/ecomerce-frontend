import { Input } from "antd"
import React from "react"

const InputForm = (props) => {
    const { placeholder='nhap text', onChange, ...rests} = props
    const handleOnchangeInput = (e) => {
        props.onChange(e.target.value)
    }
    return (
        <Input placeholder={placeholder} value={props.value} onChange={handleOnchangeInput} {...rests}  />
    )
}

export default InputForm