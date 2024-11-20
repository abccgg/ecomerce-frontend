import { Spin } from "antd"


const Loading = ({isPending, children, delay = 200}) => {
    return (
        <Spin spinning={isPending} delay={delay}>
            {children}
        </Spin>
    )
}

export default Loading