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

export function MatchEnodeIP(enode: string): string {
    const regex = /(?<=@)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?=:)/;
    const match = enode.match(regex);
    let ip = '';
    if (match) {
        ip = match[0];
    }
    return ip;
}

export function isValidIP(ip: string): boolean {
    const regex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;
    return regex.test(ip);
}

export function isValidNodeID( id : string ) : boolean {
    const regex = /^[1-9]\d*$/;
    return regex.test(id);
}