import { Button } from "antd";
import styled from "styled-components";

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 26px;
    justify-content: flex-start;
    height: 44px;
`

export const WrapperButtonMore = styled(Button)` 
    &:hover { 
        span { color: red; 
        } 
    }
    width: 100%;
`

export const WrapperProducts = styled.div`
    display: flex;
    gap: 14px;
    margin-top: 20px; 
    flex-wrap: wrap;
`

