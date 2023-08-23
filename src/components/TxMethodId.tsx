import { useMethodIdName } from "../state/application/hooks"
import { Typography, Tag, Tooltip } from 'antd';
const { Text } = Typography;

export default ({ address, methodId , subType }: { address: string, methodId: string , subType?:string }) => {
    const methodName = useMethodIdName(address, methodId,subType)
    return <>
        <Tag style={{ width: "100%", height: "24px", borderRadius: "8px" }}>
            <Tooltip title={methodName}>
                <Text style={{ width: "100%", textAlign: "center", fontSize: "14px" }} ellipsis>
                    {methodName}
                </Text>
            </Tooltip>
        </Tag>
    </>
}