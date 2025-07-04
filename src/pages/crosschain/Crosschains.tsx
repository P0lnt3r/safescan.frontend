import { Avatar, Card, Col, Divider, Row, Typography } from "antd"
import Address from "../../components/Address";
import CrosschainStatistic from "./CrosschainStatistic";

import CrosschainTxns from "./CrosschainTxns";

export default () => {

    return (<>
        <Row>
            <Col xl={0} xs={0}>
                <CrosschainStatistic />
                <Divider />
            </Col>
            <Col span={24}>
                <CrosschainTxns />
            </Col>
        </Row>
    </>)

}