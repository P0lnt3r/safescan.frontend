import { useMethodIdName } from "../state/application/hooks"
import { Typography } from 'antd';
const {Text} = Typography;

export default ( { address , methodId } : {address : string , methodId : string} ) => {
    const methodName = useMethodIdName( address , methodId )
    return <>
        <Text code>{methodName}</Text>
    </>
}