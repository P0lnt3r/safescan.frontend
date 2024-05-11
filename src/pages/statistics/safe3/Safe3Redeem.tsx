import { Card, Col, Divider, Row, Statistic, Typography } from "antd"
import { 
    ApartmentOutlined,
} from '@ant-design/icons';
import Safe3RedeemStatistic from "./Safe3RedeemStatistic";
import Safe3RedeemRecords from "./Safe3RedeemRecords";

const { Text } = Typography

export default () => {

    return <>
        <Safe3RedeemStatistic />
        <Safe3RedeemRecords />
    </>
}