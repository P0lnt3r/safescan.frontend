
import { Button, Col, Row, Card, Space, Typography, Avatar, List, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BlockOutlined } from '@ant-design/icons';
import { useTranslation, Trans } from 'react-i18next';

const { Title, Text, Link } = Typography;

const data = [
    {
        title: '2001',
    },
    {
        title: '2000',
    },
    {
        title: '1999',
    },
    {
        title: '1998',
    },
    {
        title: '2001',
    },
    {
        title: '2000',
    },
    {
        title: '1999',
    },
    {
        title: '1998',
    },
];

export default function () {

    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    return (
        <>
            <div style={{padding:'1%'}}>
                <Card>
                    放些图标 / Price / 以及其他链上统计信息..
                    <>{t('welcome')}</>
                </Card>
                <p>
                 </p>
            </div>
            <Row>
                <Col className="gutter-row" span={24} xl={12} style={{ padding: '1%' }}>
                    <Card title="Latest Blocks">
                        <List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <Row style={{ width: '100%' }}>
                                        <Col xl={2} xs={4} >
                                            <div style={{
                                                width: '100%', backgroundColor: '#0c240d0a', height: '50px', lineHeight: '50px',
                                                textAlign: 'center', maxWidth: '50px'
                                            }}>
                                                <Title level={5} style={{ lineHeight: '3' }}>Bk</Title>
                                            </div>
                                        </Col>
                                        <Col xl={8} xs={20} style={{ paddingLeft: '2%' }}>
                                            <Row>
                                                <Col xl={24} xs={4}>
                                                    <a>
                                                        {item.title}
                                                    </a>
                                                </Col>
                                                <Col xl={24} xs={16}>
                                                    <Text type="secondary">2023-01-01 12:12:12</Text>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={0} xs={4}>
                                                    <a>
                                                        0x72b61c6......5796c2b
                                                    </a>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={0} xs={8}>
                                                    <a>
                                                        172 txs
                                                    </a>
                                                </Col>
                                                <Col offset={8} xl={0} xs={8}>
                                                    <Tooltip title="Block Reward">
                                                        <Text>
                                                            0.01 SAFE
                                                        </Text>
                                                    </Tooltip>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xl={14} xs={0}>
                                            <Row>
                                                <Col xl={24}>
                                                    <a>
                                                        0x72b61c6014342d914470ec7ac2975be345796c2b
                                                    </a>
                                                </Col>
                                                <Col xl={12}>
                                                    <a>
                                                        172 txs
                                                    </a>
                                                </Col>
                                                <Col xl={12}>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <Tooltip title="Block Reward">
                                                            <Text code>
                                                                0.01 SAFE
                                                            </Text>
                                                        </Tooltip>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </List.Item>
                            )}
                            footer={
                                <>
                                    <Button type="primary" style={{ width: '100%' }} onClick={() => {
                                        navigate("/blocks");
                                    }}>View all blocks</Button>
                                </>
                            }
                        />
                    </Card>
                </Col>

                <Col className="gutter-row" span={24} xl={12} style={{ padding: '1%' }}>
                    <Card title="Latest Blocks">
                        <List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <Row style={{ width: '100%' }}>
                                        <Col xl={2} xs={4} >
                                            <div style={{
                                                width: '100%', backgroundColor: '#0c240d0a', height: '50px', lineHeight: '50px',
                                                textAlign: 'center', maxWidth: '50px'
                                            }}>
                                                <Title level={5} style={{ lineHeight: '3' }}>Tx</Title>
                                            </div>
                                        </Col>
                                        <Col xl={8} xs={20} style={{ paddingLeft: '2%' }}>
                                            <Row>
                                                <Col xl={24} xs={4}>
                                                    <a>
                                                        0x72b61c....5796c2b
                                                    </a>
                                                </Col>
                                                <Col xl={24} xs={16}>
                                                    <Text type="secondary">2023-01-01 12:12:12</Text>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={0} xs={4}>
                                                    <a>
                                                        0x72b61c6014342d914470ec7ac2975be345796c2b
                                                    </a>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={0} xs={8}>
                                                    <Text>
                                                        <span>From:</span>
                                                        <a>
                                                            0x72b61c6014....75be345796c2b
                                                        </a>
                                                    </Text>

                                                </Col>
                                                <Col offset={8} xl={0} xs={8}>
                                                    <Tooltip title="Block Reward">
                                                        <Text>
                                                            0.01 SAFE
                                                        </Text>
                                                    </Tooltip>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xl={14} xs={0}>
                                            <Row>
                                                <Col xl={24}>
                                                    <Text>
                                                        <span>From:</span>
                                                        <a>
                                                            0x72b61c6014....75be345796c2b
                                                        </a>
                                                    </Text>
                                                </Col>
                                                <Col xl={18}>
                                                    <Text>
                                                        <span>To:</span>
                                                        <a>
                                                            0x72b61c6014....75be345796c2b
                                                        </a>
                                                    </Text>
                                                </Col>
                                                <Col xl={6}>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <Tooltip title="Block Reward">
                                                            <Text code>
                                                                0.01 SAFE
                                                            </Text>
                                                        </Tooltip>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </List.Item>
                            )}
                            footer={
                                <>
                                    <Button type="primary" style={{ width: '100%' }} onClick={() => {
                                        navigate("/blocks");
                                    }}>View all blocks</Button>
                                </>
                            }
                        />
                    </Card>
                </Col>

            </Row>
        </>
    )

}