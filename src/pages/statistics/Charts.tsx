
import { Card, Typography, Input, Button, Tooltip, Row, Col, Divider } from 'antd';
import { TinyLine } from '@ant-design/plots';
const { Title, Text, Paragraph, Link } = Typography;

export default () => {

    const data = [
        264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539, 243, 226, 192,
        264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539, 243, 226, 192,
        264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539, 243, 226, 192,
        264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539, 243, 226, 192,
        264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539, 243, 226, 192,
        264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539, 243, 226, 192,
    ];
    const config = {
        height: 200,
        color:"black",
        autoFit: false,
        data,
        smooth: true,
    };

    return <>
        <Row>
            <Title level={3}>Safe Chain Charts & Statistics</Title>
        </Row>
        <Divider style={{ marginTop: "15px" }} />

        <Row>
            <Title level={5}>Blockchain Data</Title>
        </Row>
        <Row style={{ marginTop: "5px" }}>
            <Col xl={8} xs={24} style={{padding:"10px"}}>
                <Card title={<Text style={{ fontSize: "14px" }}>Daily Transaction Chart</Text>}>
                    <TinyLine {...config} />
                </Card>
            </Col>
            <Col xl={8} xs={24} style={{padding:"10px"}}>
                <Card style={{
                    cursor:"pointer"
                }} title={<Text style={{ fontSize: "14px" }}>Unique Addresses Chart</Text>}>
                    <TinyLine {...config} />
                </Card>
            </Col>
            <Col xl={8} xs={24} style={{padding:"10px"}}>
                <Card title={<Text style={{ fontSize: "14px" }}>SAFE Total Supply Chart</Text>}>
                    <TinyLine {...config} />
                </Card>
            </Col>
        </Row>

    </>

}