import { Badge, Typography } from "antd";

const { Text } = Typography;

export function RenderNodeState(state: number) {

    switch (state) {
        case 0:
            // 初始化状态
            return <>
                <Badge status="default" />
                <Text strong style={{ marginLeft: "5px" }} type="secondary">
                    INITIALIZE
                </Text>
            </>
        case 1:
            // 正常
            return <>
                <Badge status="processing" />
                <Text strong style={{ marginLeft: "5px" }}>
                    ENABLED
                </Text>
            </>
        case 2:
            // 错误
            return <>
                <Badge status="error" />
                <Text strong style={{ marginLeft: "5px" }} type="danger">
                    ERROR
                </Text>
            </>
        default:
            return <>
                <Badge status="warning" />
                <Text strong style={{ marginLeft: "5px" }} type="warning">
                    UNKNOWN
                </Text>
            </>
    }
}

export function MatchEnodeIP(enode: string) {
    return "";
}