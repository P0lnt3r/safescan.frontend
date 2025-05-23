import { Typography, Tag, Input, Tooltip, Row, Col, Divider, Badge, Card } from 'antd';
import { useMemo } from 'react';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
    FrownOutlined,
    CaretRightOutlined,
    ArrowRightOutlined,
    LockOutlined,
    UnlockOutlined,
    ExportOutlined,
    ImportOutlined,
    MedicineBoxOutlined,
    UserSwitchOutlined,
    HourglassTwoTone,
    CarryOutTwoTone,
    SyncOutlined,
    ApartmentOutlined,
    UserOutlined,
    SolutionOutlined,
    EnvironmentTwoTone,
    LoadingOutlined,
} from '@ant-design/icons';
import { AddressPropVO, ContractInternalTransactionVO, ERC20TransferVO, EventLogVO, NftTransferVO, NodeRegisterActionVO, NodeRewardVO, SafeAccountManagerActionVO, TransactionVO } from '../../services';
import { DateFormat } from '../../utils/DateUtil';
import EtherAmount, { GWEI } from '../../components/EtherAmount';
import JSBI from 'jsbi';
import { format } from '../../utils/NumberFormat';
import { useAddressFunctionFragment, useBlockNumber } from '../../state/application/hooks';
import { useDispatch } from 'react-redux';
import TxInput from './TxInput';
import { Link as RouterLink } from 'react-router-dom';
import shape from '../../images/shape-1.svg'
import ERC20TokenAmount from '../../components/ERC20TokenAmount';
import ERC20Logo from '../../components/ERC20Logo';
import { isMobile } from 'react-device-detect';
import BlockNumber from '../../components/BlockNumber';
import TxNodeRegisterActions from './TxNodeRegisterActions';
import Address, { ChecksumAddress } from '../../components/Address';
import TxNodeRewards from './TxNodeRewards';
import TxSafeAccountManagerActions from './TxSafeAccountManagerActions';
import TxInternalTxns from './TxInternalTxns';
import NftTokenTransfers from '../assets/NftTokenTransfers';
import TxNftTransfers from './TxNftTransfers';
import { Application_Crosschain_Pool_BSC, Safe4NetworkChainId } from '../../config';
import CrosschainPoolTx from './CrosschainPoolTx';
import { isCrosschainPoolTransaction } from '../../images/networks_logos/NetworkLogo';
import { ethers } from 'ethers';

const { Text, Paragraph, Link } = Typography;

export default ({ txVO, contractInternalTransactions, erc20Transfers, nodeRewards, safeAccountManagerActions, nodeRegisterActions, nftTransfers }:
    {
        txVO: TransactionVO,
        contractInternalTransactions: ContractInternalTransactionVO[] | undefined,
        erc20Transfers: ERC20TransferVO[] | undefined,
        nodeRewards: NodeRewardVO[] | undefined,
        safeAccountManagerActions: SafeAccountManagerActionVO[] | undefined,
        nodeRegisterActions: NodeRegisterActionVO[] | undefined,
        nftTransfers: NftTransferVO[] | undefined
    }) => {
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
        hasInternalError,
        confirmed,
        callType
    } = txVO
    const _blockNumber = useBlockNumber();
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
    const functionFragment = useAddressFunctionFragment(to, methodId, useDispatch(), toPropVO?.subType);
    const isCrosschainPoolTx = isCrosschainPoolTransaction( ethers.utils.getAddress(to) , ethers.utils.getAddress(from) , input );

    return <>
        <Row>
            <Col xl={8} xs={24} style={{ marginTop: '14px' }}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Transaction Hash</Text>
            </Col>
            <Col xl={16} xs={24} style={{ marginTop: '14px' }}>
                {
                    // Confirmed....
                    confirmed == 1 && <Text strong>
                        <Paragraph copyable>{hash}</Paragraph>
                    </Text>
                }
                {
                    // Unconfirmed
                    (confirmed == 0) && <>
                        <Text italic>
                            <Tooltip title="Confirming">
                                <SyncOutlined spin style={{ float: "left", marginRight: "5px", marginTop: "5px" }} />
                            </Tooltip>
                            {
                                isMobile && <>
                                    <Paragraph copyable>{hash}</Paragraph>
                                </>
                            }
                            {
                                !isMobile && <Text underline>
                                    <Paragraph copyable style={{ float: "left" }}>{hash}</Paragraph>
                                </Text >
                            }
                        </Text>
                    </>
                }
                {
                    // Pending ...
                    confirmed == -1 && <>
                        <Text italic>
                            <Tooltip title="Pending">
                                <LoadingOutlined style={{ float: "left", marginRight: "5px", marginTop: "5px" }} />
                            </Tooltip>
                            {
                                isMobile && <>
                                    <Paragraph copyable style={{ color: "gray" }} >{hash}</Paragraph>
                                </>
                            }
                            {
                                !isMobile && <Text underline>
                                    <Paragraph copyable style={{ float: "left", color: "gray" }}>{hash}</Paragraph>
                                </Text >
                            }
                        </Text>
                    </>
                }
            </Col>
        </Row>
        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col span={8}>
                <Tooltip title="The date and time at which a transaction is validated." color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Status</Text>
            </Col>
            <Col span={16}>
                {
                    status == 1 &&
                    <Tag icon={<CheckCircleOutlined />} color="green">
                        Success
                    </Tag>
                }
                {
                    status == 0 &&
                    <Tag icon={<CloseCircleOutlined />} color="red">
                        Fail with error "{revertReason}"
                    </Tag>
                }
                {
                    // Pending ..
                    status == -1 &&
                    <Tag color="rgba(119,131,143,.1)">
                        <EnvironmentTwoTone />
                        <Text style={{ color: "#77838f" }}>
                            Pending ...
                        </Text>
                    </Tag>
                }
            </Col>
        </Row>

        {
            txVO.blockNumber &&
            <>
                <Divider style={{ margin: '18px 0px' }} />
                <Row>
                    <Col span={8}>
                        <Tooltip title="Number of the block in which the transaction is recorded. Block confirmations indicate how many blocks have been added since the transaction was produced." color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Block</Text>
                    </Col>
                    <Col span={16}>
                        <BlockNumber blockNumber={blockNumber} confirmed={confirmed} />
                        <br />
                        {
                            txVO?.confirmed == 1 &&
                            <Text strong>
                                {txVO && _blockNumber - blockNumber} Blocks Confirmed
                            </Text>
                        }
                        {
                            txVO?.confirmed == 0 && <>
                                <Text italic>
                                    {txVO && _blockNumber - blockNumber} Blocks Confirmed
                                </Text>
                            </>
                        }
                    </Col>
                </Row>
            </>
        }

        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col span={8}>
                <Tooltip title="The date and time at which a transaction is validated." color='black'>
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
                <Tooltip title="The sending party of the transaction." color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>From</Text>
            </Col>
            <Col xl={16} xs={24} >
                <RouterLink to={`/address/${ChecksumAddress(from)}`}>
                    <Paragraph copyable
                        style={isMobile ? {
                            lineHeight: "26px", fontSize: "13.5px", letterSpacing: "-1px",
                            color: "rgba(52, 104, 171, 0.85)"
                        } : { color: "rgba(52, 104, 171, 0.85)" }}>
                        {ChecksumAddress(from)}
                    </Paragraph>
                </RouterLink>
                {
                    fromPropVO && <>
                        [ <Text style={{ marginBottom: "5px" }}>
                            <Address address={from} propVO={fromPropVO} style={{ hasLink: false, forceTag: true, noTip: true }} />
                        </Text> ]
                    </>
                }
            </Col>
        </Row>
        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col xl={8} xs={24} style={{ marginTop: '14px' }}>
                <Tooltip title="The receiving party of the transaction (could be a contract address)." color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>To</Text>
            </Col>
            <Col xl={16} xs={24} style={{ marginTop: '14px' }}>
                <RouterLink to={`/address/${ChecksumAddress(to)}`}>
                    <Paragraph copyable
                        style={isMobile ? {
                            lineHeight: "26px", fontSize: "13.5px", letterSpacing: "-1px",
                            color: "rgba(52, 104, 171, 0.85)"
                        } : { color: "rgba(52, 104, 171, 0.85)" }}>
                        {ChecksumAddress(to)}
                    </Paragraph>
                </RouterLink>
                {
                    toPropVO && <>
                        [ <Text style={{ marginBottom: "5px" }}>
                            <Address address={to} propVO={toPropVO} style={{ hasLink: false, forceTag: true, noTip: true }} />
                        </Text> {
                            callType == 1 && !error && <Text>
                                - Created
                            </Text>
                        }]
                    </>
                }
                {
                    error &&
                    <>
                        <br />
                        <img src={shape} style={{ width: "8px", marginTop: "-8px", marginRight: "4px" }} />
                        <Text type="danger">Warning! Error encountered during contract execution [
                            <Text type="danger" strong>{error}</Text>
                            ] <FrownOutlined /> </Text>
                    </>
                }
                {
                    // 渲染合约内部交易转账
                    !error && contractInternalTransactions &&
                    <TxInternalTxns contractInternalTransactions={contractInternalTransactions} />
                }
            </Col>
        </Row>

        {
            isCrosschainPoolTx && <CrosschainPoolTx txVO={txVO} />
        }

        {
            // ERC20 Transfer 列表
            erc20Transfers && erc20Transfers.length > 0 &&
            <>
                <Divider style={{ margin: '18px 0px' }} />
                <Row>
                    <Col xl={8} xs={24}>
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Tokens Transferred:  <Tag color="#77838f">{erc20Transfers.length}</Tag></Text>
                    </Col>
                    <Col xl={16} xs={24}>
                        {
                            erc20Transfers.map(erc20TransferVO => {
                                const { transactionHash, from, to, token, tokenPropVO, value, fromPropVO, toPropVO } = erc20TransferVO;
                                const erc20Prop = tokenPropVO && tokenPropVO.subType === "erc20" ? tokenPropVO?.prop : undefined;
                                const erc20 = erc20Prop ? JSON.parse(erc20Prop) : undefined;
                                return (<>
                                    <Row style={{ marginTop: "2px" }}>
                                        <Text strong style={{ marginRight: "5px" }}><CaretRightOutlined /> From</Text>
                                        <Address address={from} propVO={fromPropVO} />
                                        <Text strong style={{ marginLeft: "5px", marginRight: "5px" }}> To</Text>
                                        <Address address={to} propVO={toPropVO} />
                                        <Text strong style={{ marginRight: "5px", marginLeft: "5px" }}> For</Text>
                                        <ERC20TokenAmount address={token} name={erc20.name} symbol={erc20.symbol} decimals={erc20.decimals} raw={value}
                                            fixed={erc20.decimals} />
                                        <span style={{ marginRight: "5px" }}></span>
                                        <ERC20Logo address={token} />
                                        <Link href='#' ellipsis style={{ width: '20%', marginLeft: "5px" }}>
                                            {erc20.name}({erc20.symbol})
                                        </Link>
                                    </Row>
                                </>)
                            })
                        }
                    </Col>
                </Row>
            </>
        }

        {
            nftTransfers && nftTransfers.length > 0 && <TxNftTransfers nftTransfers={nftTransfers} />
        }
        {
            // 节点奖励
            nodeRewards && nodeRewards.length > 0 &&
            <>
                <TxNodeRewards nodeRewards={nodeRewards} />
            </>
        }
        {
            // 节点注册|追加注册
            nodeRegisterActions && nodeRegisterActions.length > 0 && <>
                <Divider style={{ margin: '18px 0px' }} />
                <Row>
                    <Col xl={8} xs={24}>
                        <Tooltip title="" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Node Actions</Text>
                    </Col>
                    <Col xl={12} xs={24}>
                        <TxNodeRegisterActions nodeRegisterActions={nodeRegisterActions} />
                    </Col>
                </Row>
            </>
        }
        {
            // SafeAccountManagerActions 锁仓这种数据.
            safeAccountManagerActions && safeAccountManagerActions.length > 0 &&
            <TxSafeAccountManagerActions safeAccountManagerActions={safeAccountManagerActions} />
        }

        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col xl={8} xs={24}>
                <Tooltip title="The value being transacted in SAFE and fiat value. Note: You can click the fiat value (if available) to see historical value at the time of transaction." color='black'>
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
                <Tooltip title="Amount paid to the validator for processing the transaction." color='black'>
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
                <Tooltip title="Cost per unit of gas specified for the transaction, in SAFE and Gwei. The higher the gas price the higher chance of getting included in a block." color='black'>
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
                <Tooltip title="Maximum amount of gas allocated for the transaction & the amount eventually used. Normal SAFE transfers involve 21,000 gas units while contracts involve higher values." color='black'>
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
                <Tooltip title="Other data related to this transaction." color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Other Attributes</Text>
            </Col>
            <Col xl={16} xs={24}>
                {
                    <>
                        <Tag>{`Nonce:${nonce}`}</Tag>
                        <Tag>{`Position:${transactionIndex}`}</Tag>
                    </>
                }
            </Col>
        </Row>
        <Row style={{ margin: '18px 0px' }}>
            <Col xl={8} xs={24} style={{ marginTop: '14px' }}>
                <Tooltip title="Additional data included for this transaction. Commonly used as part of contract interaction or as a message sent to the recipient." color='black'>
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