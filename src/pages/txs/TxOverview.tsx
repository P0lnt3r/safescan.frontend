import { Typography, Tag, Input, Tooltip, Row, Col, Divider } from 'antd';
import { useMemo } from 'react';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
    FrownOutlined
} from '@ant-design/icons';
import { ContractInternalTransactionVO, TransactionVO } from '../../services';
import { DateFormat } from '../../utils/DateUtil';
import EtherAmount, { GWEI } from '../../components/EtherAmount';
import JSBI from 'jsbi';
import { format } from '../../utils/NumberFormat';
import { useAddressFunctionFragment } from '../../state/application/hooks';
import { useDispatch } from 'react-redux';
import TxInput from './TxInput';
import NavigateLink from '../../components/NavigateLink';
import { CurrencyAmount } from '@uniswap/sdk';
import { Link as RouterLink } from 'react-router-dom';
import shape from '../../images/shape-1.svg'
import ContractInternalTransactions from './ContractInternalTransactions';

const { Text, Paragraph, Link } = Typography;

export default ({ txVO, contractInternalTransactions }: { txVO: TransactionVO, contractInternalTransactions: ContractInternalTransactionVO[] | undefined }) => {

    const {
        blockHash,
        blockNumber,
        from, fromPropVO,
        gas,
        gasPrice,
        gasUsed,
        hash,
        input,
        methodId,
        nonce,
        status,
        timestamp,
        to, toPropVO,
        transactionIndex,
        value,
        error,
        revertReason,
        hasInternalError
    } = txVO

    const { txFee, gasPriceGWEI, gasUsedRate } = useMemo(() => {
        const txFee = (gasPrice && gasUsed) ? JSBI.multiply(
            JSBI.BigInt(gasPrice),
            JSBI.BigInt(gasUsed)
        ).toString() : "0";
        const gasPriceGWEI = (gasPrice) ? GWEI(gasPrice) : "0";
        const gasUsedRate = (gas && gasUsed) ? Math.round(Number(gasUsed) / Number(gas) * 10000) / 100 + "%" : "";
        return {
            txFee, gasPriceGWEI, gasUsedRate
        }
    }, [gasPrice, gasUsed, gas]);

    const functionFragment = useAddressFunctionFragment(to, methodId, useDispatch());

    return <>
        <Row>
            <Col xl={8} xs={24} style={{ marginTop: '14px' }}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Transaction Hash</Text>
            </Col>
            <Col xl={16} xs={24} style={{ marginTop: '14px' }}>
                <Text>
                    <Paragraph copyable>
                        {hash}
                    </Paragraph>
                </Text>
            </Col>
        </Row>
        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col span={8}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Status</Text>
            </Col>
            <Col span={16}>
                {
                    status === 1 &&
                    <Tag icon={<CheckCircleOutlined />} color="green">
                        Success
                    </Tag>
                }
                {
                    status === 0 &&
                    <Tag icon={<CloseCircleOutlined />} color="red">
                        Fail with error "{revertReason}"
                    </Tag>
                }
            </Col>
        </Row>
        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col span={8}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Block</Text>
            </Col>
            <Col span={16}>
                <Text strong>
                    <RouterLink to={`/block/${blockNumber}`}>
                        {blockNumber}
                    </RouterLink>
                </Text>
            </Col>
        </Row>
        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col span={8}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>DateTime</Text>
            </Col>
            <Col span={16}>
                <Text>
                    {
                        timestamp ? <>{DateFormat(timestamp * 1000)}</> : <></>
                    }
                </Text>
            </Col>
        </Row>

        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col xl={8} xs={24} style={{ marginTop: '14px' }}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>From</Text>
            </Col>
            <Col xl={16} xs={24} style={{ marginTop: '14px' }}>
                <RouterLink to={`/address/${from}`}>
                    <Paragraph copyable style={{ color: "rgba(52, 104, 171, 0.85)" }}>
                        {from}
                    </Paragraph>
                </RouterLink>
            </Col>
        </Row>
        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col xl={8} xs={24} style={{ marginTop: '14px' }}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>To</Text>
            </Col>
            <Col xl={16} xs={24} style={{ marginTop: '14px' }}>
                <RouterLink to={`/address/${to}`}>
                    <Paragraph copyable style={{ color: "rgba(52, 104, 171, 0.85)" }}>
                        {to}
                    </Paragraph>
                </RouterLink>
                {
                    toPropVO && <>
                        ({toPropVO.tag})
                    </>
                }
                {
                    error &&
                    <>
                        <img src={shape} style={{ width: "8px", marginTop: "-8px", marginRight: "4px" }} />
                        <Text type="danger">Warning! Error encountered during contract execution [
                            <Text type="danger" strong>{error}</Text>
                            ] <FrownOutlined /> </Text>
                    </>
                }
                {
                    !error && contractInternalTransactions &&
                    <>
                        {
                            contractInternalTransactions.map((contractInternalTransactionVO) => {
                                const { id, type, from, to, value } = contractInternalTransactionVO;
                                return (type != 'CREATE2' &&
                                    <Row key={id}>
                                        <img src={shape} style={{ width: "8px", marginTop: "-8px", marginRight: "4px" }} />
                                        <Text type='secondary' strong>
                                            {
                                                value && type === 'CALL' && "TRANSFER"
                                            }
                                            {
                                                'CALL' !== type && type
                                            }
                                        </Text>
                                        {
                                            value && type === 'CALL' && <Text style={{marginLeft:'4px' , marginRight:'4px'}}> 
                                                <EtherAmount raw={value} fix={18}></EtherAmount> 
                                            </Text>
                                        }
                                        <Text type='secondary' style={{marginLeft:'4px' , marginRight:'4px'}}> From </Text>
                                        <Tooltip title={from}>
                                            <RouterLink to={`/addresses/${from}`} style={{minWidth:"100px",maxWidth:"20%"}}>
                                                <Link ellipsis>{from}</Link>
                                            </RouterLink>
                                        </Tooltip>
                                        <Text type='secondary' style={{marginLeft:'4px' , marginRight:'4px'}}> To </Text>
                                        <Tooltip title={to}>
                                            <RouterLink to={`/addresses/${to}`} style={{minWidth:"100px",maxWidth:"20%"}}>
                                                <Link ellipsis>{to}</Link>
                                            </RouterLink>
                                        </Tooltip>
                                    </Row>
                                )
                            })
                        }
                    </>
                }
            </Col>
        </Row>

        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col xl={8} xs={24}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Value</Text>
            </Col>
            <Col xl={16} xs={24}>
                {
                    value && <Text strong><EtherAmount raw={value.toString()} fix={18} /></Text>
                }
                {
                    revertReason && <> -
                        <Tooltip title={`Value transfer did not complete from a contract ${error}`} placement="right">
                            <Text type='danger' strong>[CANCELED]</Text>
                        </Tooltip>
                    </>
                }
            </Col>
        </Row>

        <Row style={{ margin: '18px 0px' }}>
            <Col xl={8} xs={24}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Txn Fee</Text>
            </Col>
            <Col xl={16} xs={24}>
                {
                    <Text type="secondary"><EtherAmount raw={txFee} fix={18} /></Text>
                }
            </Col>
        </Row>

        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col xl={8} xs={24}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Gas Price</Text>
            </Col>
            <Col xl={16} xs={24}>
                {
                    <><EtherAmount raw={gasPrice} fix={18}></EtherAmount> ({gasPriceGWEI}Gwei) </>
                }
            </Col>
        </Row>

        <Row style={{ margin: '18px 0px' }}>
            <Col xl={8} xs={24}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Gas Limit <Divider type="vertical" /> Usage by Txn</Text>
            </Col>
            <Col xl={16} xs={24}>
                {
                    <>
                        <Text>{gas && format(`${gas}`)}</Text>
                        <Divider type="vertical" />
                        <Text>{gasUsed && format(gasUsed)} ({gasUsedRate})</Text>
                    </>
                }
            </Col>
        </Row>

        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col xl={8} xs={24}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Other Attributes</Text>
            </Col>
            <Col xl={16} xs={24}>
                {
                    <>
                        <Tag>{`Position:${transactionIndex}`}</Tag>
                        <Tag>{`Nonce:${nonce}`}</Tag>
                    </>
                }
            </Col>
        </Row>

        <Row style={{ margin: '18px 0px' }}>
            <Col xl={8} xs={24} style={{ marginTop: '14px' }}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Input Data</Text>
            </Col>
            <Col xl={16} xs={24} style={{ marginTop: '14px' }}>
                <TxInput raw={input} fragment={functionFragment} methodId={methodId} ></TxInput>
            </Col>
        </Row>

    </>

}