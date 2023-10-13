
import { Button, Col, Row, Card, Space, Typography, Avatar, List, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BlockOutlined } from '@ant-design/icons';
import { useTranslation, Trans } from 'react-i18next';
import { useEffect } from 'react';
import { useDBStoredBlockNumber, useLatestBlocks, useLatestTransactions } from '../../state/application/hooks';
import { DateFormat } from '../../utils/DateUtil';
import AddressTag from '../../components/AddressTag';
import NavigateLink from '../../components/NavigateLink';
import TransactionHash from '../../components/TransactionHash';
import EtherAmount from '../../components/EtherAmount';
import { Link as RouterLink } from 'react-router-dom';
import { FileTextOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import Address from '../../components/Address';

const { Title, Text, Link } = Typography;

export default function () {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const dbStoredBlockNumber = useDBStoredBlockNumber();
    const blocks = useLatestBlocks();
    const transactions = useLatestTransactions();

    return (
        <>
            <Row>
                <Col className="gutter-row" span={24} xl={12} style={{ paddingTop:"1%",paddingRight:"1%" }}>
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
                                                <Col xl={24} xs={10}>
                                                    <NavigateLink path={`/block/${blockVO.number}`}>
                                                        {
                                                            blockVO.number > dbStoredBlockNumber ? <Link italic underline>{blockVO.number}</Link>
                                                                : <Link>{blockVO.number}</Link>
                                                        }
                                                    </NavigateLink>
                                                </Col>
                                                <Col xl={24} xs={14} style={isMobile ? { textAlign: "right" } : {}}>
                                                    <Text type="secondary">
                                                        {DateFormat(blockVO.timestamp * 1000)}
                                                    </Text>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={0} xs={24}>
                                                    <Address address={blockVO.miner} propVO={blockVO.minerPropVO} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={0} xs={8}>
                                                    <NavigateLink path={`/txs?block=${blockVO.number}`}>
                                                        {blockVO.txns} txns
                                                    </NavigateLink>
                                                </Col>
                                                <Col xl={0} xs={16} style={{ textAlign: "right" }}>
                                                    <Tooltip title="Block Reward">
                                                        <Text code>
                                                            <EtherAmount fix={4} raw={blockVO.reward}></EtherAmount>
                                                        </Text>
                                                    </Tooltip>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xl={14} xs={0}>
                                            <Row>
                                                <Col xl={24}>
                                                    <Address address={blockVO.miner} propVO={blockVO.minerPropVO} />
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
                                                                <EtherAmount fix={4} raw={blockVO.reward}></EtherAmount>
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

                <Col className="gutter-row" span={24} xl={12} style={{ paddingTop:"1%",paddingLeft:"1%" }}>
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
                                                <Col xl={24} xs={10}>
                                                    <TransactionHash txhash={transaction.hash} blockNumber={transaction.blockNumber}></TransactionHash>
                                                </Col>
                                                <Col xl={24} xs={14} style={isMobile ? { textAlign: "right" } : {}}>
                                                    <Text type="secondary">
                                                        {DateFormat(transaction.timestamp * 1000)}
                                                    </Text>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={0} xs={24}>
                                                    <Text>
                                                        <span>From:</span>
                                                        <Address address={transaction.from} propVO={transaction.fromPropVO} />
                                                    </Text>
                                                </Col>
                                                <Col xl={0} xs={24}>
                                                    <Text>
                                                        <span>To:</span>
                                                        <Address address={transaction.to} propVO={transaction.toPropVO} />
                                                    </Text>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col offset={8} xl={0} xs={16} style={{ textAlign: "right" }}>
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
                                                        <Address address={transaction.from} propVO={transaction.fromPropVO} />
                                                    </Text>
                                                </Col>
                                                <Col xl={14}>
                                                    <Text>
                                                        <span>To:</span>
                                                        <Address address={transaction.to} propVO={transaction.toPropVO} />
                                                    </Text>
                                                </Col>
                                                <Col xl={10}>
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