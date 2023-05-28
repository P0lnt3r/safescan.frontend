
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
import { Link as RouterLink } from 'react-router-dom';
import { FileTextOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

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
                                                <Col xl={0} xs={24}>
                                                    <Tooltip title={blockVO.miner}>
                                                        <RouterLink to={`/address/${blockVO.miner}`}>
                                                            <Link ellipsis>
                                                                {
                                                                    blockVO.minerPropVO && <>{blockVO.minerPropVO.tag}</>
                                                                }
                                                                {
                                                                    !blockVO.minerPropVO && <>{blockVO.miner}</>
                                                                }
                                                            </Link>
                                                        </RouterLink>
                                                    </Tooltip>
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
                                                    <Tooltip title={blockVO.miner}>
                                                        <RouterLink to={`/address/${blockVO.miner}`}>
                                                            <Link ellipsis>
                                                                {
                                                                    blockVO.minerPropVO && <>{blockVO.minerPropVO.tag}</>
                                                                }
                                                                {
                                                                    !blockVO.minerPropVO && <>{blockVO.miner}</>
                                                                }
                                                            </Link>
                                                        </RouterLink>
                                                    </Tooltip>
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
                                                        <Tooltip title={transaction.from}>
                                                            <RouterLink to={`/address/${transaction.from}`}>
                                                                <Link ellipsis>
                                                                    {
                                                                        transaction.fromPropVO && <>{transaction.fromPropVO.tag}</>
                                                                    }
                                                                    {
                                                                        !transaction.fromPropVO && <>{transaction.from}</>
                                                                    }
                                                                </Link>
                                                            </RouterLink>
                                                        </Tooltip>
                                                    </Text>
                                                </Col>
                                                <Col xl={0} xs={24}>
                                                    <Text>
                                                        <span>To:</span>
                                                        {
                                                            transaction.toPropVO && transaction.toPropVO.type == "contract" &&
                                                            <Tooltip title='Contract'>
                                                                <FileTextOutlined style={{ marginLeft: "2px", marginRight: "2px" }} />
                                                            </Tooltip>
                                                        }
                                                        <Tooltip title={transaction.to}>
                                                            <RouterLink to={`/address/${transaction.to}`}>
                                                                <Link ellipsis style={{ width: "80%" }}>
                                                                    {
                                                                        transaction.toPropVO && <>{transaction.toPropVO.tag}</>
                                                                    }
                                                                    {
                                                                        !transaction.toPropVO && <>{transaction.to}</>
                                                                    }
                                                                </Link>
                                                            </RouterLink>
                                                        </Tooltip>
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
                                                        <Tooltip title={transaction.from}>
                                                            <RouterLink to={`/address/${transaction.from}`}>
                                                                <Link ellipsis>
                                                                    {
                                                                        transaction.fromPropVO && <>{transaction.fromPropVO.tag}</>
                                                                    }
                                                                    {
                                                                        !transaction.fromPropVO && <>{transaction.from}</>
                                                                    }
                                                                </Link>
                                                            </RouterLink>
                                                        </Tooltip>
                                                    </Text>
                                                </Col>
                                                <Col xl={18}>
                                                    <Text>
                                                        <span>To:</span>
                                                        {
                                                            transaction.toPropVO && transaction.toPropVO.type == "contract" &&
                                                            <Tooltip title='Contract'>
                                                                <FileTextOutlined style={{ marginLeft: "2px", marginRight: "2px" }} />
                                                            </Tooltip>
                                                        }
                                                        <Tooltip title={transaction.to}>
                                                            <RouterLink to={`/address/${transaction.to}`}>
                                                                <Link ellipsis style={{ width: "80%" }}>
                                                                    {
                                                                        transaction.toPropVO && <>{transaction.toPropVO.tag}</>
                                                                    }
                                                                    {
                                                                        !transaction.toPropVO && <>{transaction.to}</>
                                                                    }
                                                                </Link>
                                                            </RouterLink>
                                                        </Tooltip>
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