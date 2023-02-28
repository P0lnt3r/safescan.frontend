import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider } from 'antd';
import { Topics, Topics_Config } from "../utils/decode/config"

const { Text, Link } = Typography;

export default ( { topic } : {topic : Topics} ) => {

    let name = Topics_Config[topic] ? Topics_Config[topic].name : topic;
    if ( Topics_Config[topic] ){
        let firstSpace = name.indexOf("(");
        let params = name.substring(firstSpace + 1 , name.length - 1);
        let paramsArr = params.split(",");
        let arr = paramsArr.map( (paramSignature , index) => {
            let _arr = paramSignature.split(" ");
            return _arr.length == 3 ? {
                index : _arr[0],
                type  : _arr[1],
                name  : _arr[2]
            } : {
                index : undefined,
                type  : _arr[0],
                name  : _arr[1]
            }
        })
    }

    return <>
        <Text>
            {name}
        </Text>
    </>
}