import { Row } from "antd";
import styled from "styled-components"

export const WrapperHeader = styled(Row)`
    padding: 10px 120px;
    background-color: rgb(26, 148, 255);
    gap: 16px;
    flex-wrap: nowrap;
    width: 1270px;
    padding: 10px 0;
`

export const WrapperTextHeader = styled.span`
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    text-align: left;
    cursor: pointer
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-item: center;
    color: #fff;
    gap: 10px;
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer
`

export const WrapperContentPopup = styled.p` 
    cursor: pointer;
    &:hover{
        color: rgb(26, 148, 255);
    }
`


