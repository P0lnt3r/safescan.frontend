
import { Button, Col, Row, Card, Space, Typography, Avatar, List, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BlockOutlined } from '@ant-design/icons';
import { useTranslation, Trans } from 'react-i18next';
import { useEffect } from 'react';
import { useLatestBlocks, useLatestTransactions } from '../../state/application/hooks';
import { DateFormat } from '../../utils/DateUtil';
import AddressTag from '../../components/AddressTag';
import NavigateLink from '../../components/NavigateLink';
import TransactionHash from '../../components/TransactionHash';
import EtherAmount from '../../components/EtherAmount';

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

    const blocks = useLatestBlocks();
    const transactions = useLatestTransactions();

    return (
        <>
            <Row>
                <Col className="gutter-row" span={24} xl={12} style={{ padding: '1%' }}>
                    <Card title="Latest Blocks">
                        <List
                            itemLayout="horizontal"
                            dataSource={blocks}
                            renderItem={blockVO => (
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
                                                <Col xl={24} xs={12}>
                                                    <NavigateLink path={`/block/${blockVO.number}`}>
                                                        {blockVO.number}
                                                    </NavigateLink>
                                                </Col>
                                                <Col xl={24} xs={12}>
                                                    <Text type="secondary">
                                                        {DateFormat(blockVO.timestamp * 1000)}
                                                    </Text>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={0} xs={4}>
                                                    <AddressTag address={blockVO.miner} sub={8}></AddressTag>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={0} xs={8}>
                                                    <NavigateLink path={`/txs?block=${blockVO.number}`}>
                                                        {blockVO.txns} txns
                                                    </NavigateLink>
                                                </Col>
                                                <Col offset={8} xl={0} xs={8}>
                                                    <Tooltip title="Block Reward">
                                                        <Text code>
                                                            <EtherAmount raw="100000000000"></EtherAmount>
                                                        </Text>
                                                    </Tooltip>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xl={14} xs={0}>
                                            <Row>
                                                <Col xl={24}>
                                                    <AddressTag address={blockVO.miner} sub={8}></AddressTag>
                                                </Col>
                                                <Col xl={12}>
                                                    <NavigateLink path={`/txs?block=${blockVO.number}`}>
                                                        {blockVO.txns} txns
                                                    </NavigateLink>
                                                </Col>
                                                <Col xl={12}>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <Tooltip title="Block Reward">
                                                            <Text code>
                                                                <EtherAmount raw="100000000000"></EtherAmount>
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
                    <Card title="Latest Transactions">
                        <List
                            itemLayout="horizontal"
                            dataSource={transactions}
                            renderItem={transaction => (
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
                                                <Col xl={24} xs={12}>
                                                    <TransactionHash txhash={transaction.hash} sub={6}></TransactionHash>
                                                </Col>
                                                <Col xl={24} xs={12}>
                                                    <Text type="secondary">
                                                        {DateFormat(transaction.timestamp * 1000)}
                                                    </Text>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={0} xs={24}>
                                                    <Text>
                                                        <span>From:</span>
                                                        <AddressTag address={transaction.from} sub={8}></AddressTag>
                                                    </Text>
                                                </Col>
                                                <Col xl={0} xs={24}>
                                                    <Text>
                                                        <span>To:</span>
                                                        <AddressTag address={transaction.to} sub={8}></AddressTag>
                                                    </Text>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col offset={16} xl={0} xs={8}>
                                                    <Tooltip title="Amount">
                                                        <Text code>
                                                            <EtherAmount fix={4} raw={transaction.value.toString()}></EtherAmount>
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
                                                        <AddressTag address={transaction.from} sub={8}></AddressTag>
                                                    </Text>
                                                </Col>
                                                <Col xl={18}>
                                                    <Text>
                                                        <span>To:</span>
                                                        <AddressTag address={transaction.to} sub={8}></AddressTag>
                                                    </Text>
                                                </Col>
                                                <Col xl={6}>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <Tooltip title="Amount">
                                                            <Text code>
                                                                <EtherAmount fix={4} raw={transaction.value.toString()}></EtherAmount>
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
                                        navigate("/txs");
                                    }}>View all transactions</Button>
                                </>
                            }
                        />
                    </Card>
                </Col>

            </Row >
        </>
    )

}