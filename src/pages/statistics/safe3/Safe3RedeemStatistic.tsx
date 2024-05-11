import { Card, Col, Divider, Row, Statistic, Typography } from "antd"
import { 
    ApartmentOutlined,
} from '@ant-design/icons';

const { Text } = Typography

export default () => {

    return <>

        <Card title="Safe3 Network Asset Statistics">
            <Row>
                <Col xl={6} xs={24} style={{ padding: "1%" }}>
                    <Statistic title="Safe3 Total SAFE Amount" value={`3213`} />
                    <Divider />
                    <Statistic title="Safe3 Masternodes" value={"9017"} />
                    <Col xl={0} xs={24}>
                        <Divider />
                    </Col>
                </Col>
                <Col xl={8} xs={24} style={{ padding: "1%" }}>
                    <Row>
                        <Col span={12}>
                            <Statistic title="已迁移" value={"321312"}/>
                        </Col>
                        <Col span={12}>
                            <Statistic style={{ float: "right" }} valueStyle={{ float: "right" }} title={
                                <Text style={{ float: "right" }} type="secondary">未迁移(12.32%)</Text>}
                                value={3213212}
                            />
                        </Col>
                    </Row>
                    <Divider />
                    <Row>
                        <Col span={12}>
                            <Statistic title="已迁移" value={32132} prefix={<ApartmentOutlined />} />
                        </Col>
                        <Col span={12}>
                            <Statistic style={{ float: "right" }} valueStyle={{ float: "right" }} title={
                                <Text style={{ float: "right" }} type="secondary">Active Masternodes</Text>}
                                value={32121} suffix={<ApartmentOutlined />}
                            />
                        </Col>
                    </Row>
                    <Col xl={0} xs={24}>
                        <Divider />
                    </Col>
                </Col>
            </Row>
        </Card>

    </>
}