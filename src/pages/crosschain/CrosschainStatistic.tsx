import { Card, Col, Row, Typography } from "antd"
import Address from "../../components/Address";
const { Text } = Typography;

export default () => {

    return <>
        <Card title="Statistic">
            <Row>
                <Col xl={8} xs={24} style={{ padding: "10px" }}>
                    <Card title="SAFE4 / BNB Smart Network">
                        <Row>
                            <Col span={24}>
                                <Text type="secondary">SAFE4 Asset Pool Address</Text>
                                <br />
                                <Address address="0x471B9eB32a6750b0356E0C80294Ee035C4bdF60B"></Address>
                            </Col>
                            <Col span={24}>
                                <Text type="secondary">Balance of Asset Pool Address</Text>
                                <br />
                                <Address address="0x471B9eB32a6750b0356E0C80294Ee035C4bdF60B"></Address>
                            </Col>


                            <Col span={24}>
                                <Text type="secondary">BSC Contract Address</Text>
                                <br />
                                <Address address="0x471B9eB32a6750b0356E0C80294Ee035C4bdF60B"></Address>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xl={8} xs={24} style={{ padding: "10px" }}>
                    <Card title="SAFE4 / BNB Smart Network"></Card>
                </Col>
                <Col xl={8} xs={24} style={{ padding: "10px" }}>
                    <Card title="SAFE4 / BNB Smart Network"></Card>
                </Col>
            </Row>
        </Card>
    </>

}