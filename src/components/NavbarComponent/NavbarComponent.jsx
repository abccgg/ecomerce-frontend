import React from 'react'
import { WrapperContent, WrapperLableText, WrapperTextValue } from './style'
import { Checkbox, Rate } from 'antd'

const NavbarComponent = () => {
    const onChange = () => {}
    const renderContent = (type, options) => {
      switch (type) {
        case "text":
          return options.map((option) => {
            return <WrapperTextValue>{option}</WrapperTextValue>;
          });
        case "checkbox":
          return (
            <Checkbox.Group
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
              onChange={onChange}
            >
              {options.map((option) => {
                return <Checkbox value={option.value}>{option.label}</Checkbox>;
              })}
            </Checkbox.Group>
          );
        case "star":
          return options.map((option) => {
            return (
              <div style={{ display: "flex" }}>
                <Rate
                  style={{ fontSize: "12px" }}
                  disabled
                  defaultValue={option}
                />
                <span> {`tu ${option} sao`}</span>
              </div>
            );
          });
        case "price":
          return options.map((option) => {
            return (
              <div
                style={{
                  padding: "4px",
                  backgroundColor: "gray",
                  borderRadius: "10px",
                  width: "fit-content",
                }}
              >
                {option}
              </div>
            );
          });
        default:
          return {};
      }
    };


  return (
    <div>
        <WrapperLableText>lable</WrapperLableText>
        <WrapperContent>
            {renderContent('text', ['TV', 'Tu Lanh', 'Dien Thoai'])}
        </WrapperContent>    
        <WrapperContent>
        {renderContent('checkbox', [
                {value: 'a', label: 'A'},
                {value: 'b', label: 'B'}
            ])}
        </WrapperContent>
        <WrapperContent>
        {renderContent('star', [3,4,5 ])}
        </WrapperContent>
        <WrapperContent>
        {renderContent('price', ['duoi 40k', 'tren 50k' ])}
        </WrapperContent>
    </div>
  )
}

export default NavbarComponent