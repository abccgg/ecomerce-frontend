import { Upload } from "antd";
import styled from "styled-components";


export const WrapperHeader = styled.h1`
    color: #000;
    font-size: 14;
`


export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px !important;
        height: 60px !important;
        border-radius: 50% !important;
    }
    & .ant-upload-list-item-info {
        display: none !important;
    }
    & .ant-upload-list-item {
        display: none !important;
    }
`;