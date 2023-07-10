import { Typography, Tag, Input, Tooltip, Row, Col, Divider } from 'antd';
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
    SyncOutlined,
} from '@ant-design/icons';
import { AddressPropVO, ContractInternalTransactionVO, ERC20TransferVO, EventLogVO, NodeRewardVO, SafeAccountManagerActionVO, TransactionVO } from '../../services';
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

const { Text, Paragraph, Link } = Typography;

export default ({ txVO, contractInternalTransactions, erc20Transfers, nodeRewards, safeAccountManagerActions }:
    {
        txVO: TransactionVO,
        contractInternalTransactions: ContractInternalTransactionVO[] | undefined,
        erc20Transfers: ERC20TransferVO[] | undefined,
        nodeRewards: NodeRewardVO[] | undefined,
        safeAccountManagerActions: SafeAccountManagerActionVO[] | undefined,
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
        confirmed
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
    const functionFragment = useAddressFunctionFragment(to, methodId, useDispatch());

    const { superNode, masterNode } = useMemo<{
        superNode?: { address: string, propVO: AddressPropVO },
        masterNode?: { address: string, propVO: AddressPropVO },
    }>(() => {
        let superNode, masterNode;
        if (nodeRewards) {
            nodeRewards.forEach(nodeReward => {
                if (nodeReward.nodeType == 1) {
                    superNode = {
                        address: nodeReward.nodeAddress,
                        propVO: nodeReward.nodeAddressPropVO
                    }
                } else if (nodeReward.nodeType == 2) {
                    masterNode = {
                        address: nodeReward.nodeAddress,
                        propVO: nodeReward?.nodeAddressPropVO
                    }
                }
            })
        }
        return {
            superNode, masterNode
        }
    }, [nodeRewards]);

    const RewardTypeLabel = (rewardType: number) => {
        switch (rewardType) {
            case 1:
                return "Creator";
            case 2:
                return "Founder";
            case 3:
                return "Voter";
        }
    }
    const RenderNodeReward = (nodeReward: NodeRewardVO) => {
        const { address, addressPropVO, rewardType, amount } = nodeReward;
        const rewardTypeLabel = RewardTypeLabel(rewardType);
        return <>
            <Row>
                <Col style={{ minWidth: "260px" }}>
                    <img src={shape} style={{ width: "8px", marginTop: "-2px", marginRight: "4px" }} />
                    <Text style={{ marginRight: "5px" }} type="secondary" >[{rewardTypeLabel}]</Text>
                    <EtherAmount raw={amount} fix={18} />
                </Col>
                <Col xl={16} xs={24}>
                    <Text><ArrowRightOutlined style={{ marginLeft: "15px", marginRight: "10px" }} />
                        {
                            addressPropVO &&
                            <Tooltip title={address}>
                                <RouterLink to={`/address/${address}`}>
                                    <Link>{addressPropVO?.tag}</Link>
                                </RouterLink>
                            </Tooltip>
                        }
                        {
                            !addressPropVO &&
                            <RouterLink to={`/address/${address}`}>
                                <Link>{address}</Link>
                            </RouterLink>
                        }
                    </Text>
                </Col>
            </Row>
        </>
    }

    const RenderContractInternalTransaction = (contractInternalTransaction: ContractInternalTransactionVO) => {
        const { id, type, from, to, value } = contractInternalTransaction;
        return (type != 'CREATE2' &&
            <Row key={ id }>
                <img src={shape} style={{ width: "8px", marginTop: "-2px", marginRight: "4px" }} />
                <Text type='secondary' strong>
                    {
                        value && type === 'CALL' && "TRANSFER"
                    }
                    {
                        'CALL' !== type && type
                    }
                </Text>
                {
                    value && type === 'CALL' && <Text style={{ marginLeft: '4px', marginRight: '4px' }}>
                        <EtherAmount raw={value} fix={18}></EtherAmount>
                    </Text>
                }
                <Text type='secondary' style={{ marginLeft: '4px', marginRight: '4px' }}> From </Text>
                <Tooltip title={from}>
                    <RouterLink to={`/addresses/${from}`} style={{ minWidth: "100px", maxWidth: "20%" }}>
                        <Link ellipsis>{from}</Link>
                    </RouterLink>
                </Tooltip>
                <Text type='secondary' style={{ marginLeft: '4px', marginRight: '4px' }}> To </Text>
                <Tooltip title={to}>
                    <RouterLink to={`/addresses/${to}`} style={{ minWidth: "100px", maxWidth: "20%" }}>
                        <Link ellipsis>{to}</Link>
                    </RouterLink>
                </Tooltip>
            </Row>
        )
    }

    const RenderSafeAccountManagerAction = (safeAccountManagerAction: SafeAccountManagerActionVO) => {
        const { lockId, action, amount, to, lockDay } = safeAccountManagerAction;
        const lockIds = JSON.parse(lockId);
        const isDeposit = action == "SafeDeposit";
        const isWithdraw = action == "SafeWithdraw";
        const isTransfer = action == "SafeTransfer";
        const isAddLock = action == "SafeAddLockDay";
        const OutputActionAndLabel = () => {
            if (isDeposit) {
                return <>
                    <ImportOutlined />
                    <Text type='secondary'> [Deposit]</Text>
                </>;
            }
            if (isWithdraw) {
                return <>
                    <ExportOutlined />
                    <Text type='secondary'> [Withdraw]</Text>
                </>;
            }
            if (isAddLock) {
                return <>
                    <MedicineBoxOutlined />
                    <Text type='secondary'> [AddLock]</Text>
                </>;
            }
            return <>
                <SyncOutlined />
                <Text type='secondary'> [Transfer]</Text>
            </>;
        }
        return <Row>
            {!isMobile && <>
                <Col span={24}>
                    {
                        <>
                            {OutputActionAndLabel()}
                            <span style={{ marginLeft: "2%" }}></span>
                            <EtherAmount raw={amount} fix={18}></EtherAmount>
                            {
                                <>
                                    <ArrowRightOutlined style={{ marginLeft: "1%", marginRight: "1%" }} />
                                    <Tooltip title={to}>
                                        <RouterLink to={`/address/${to}`}>
                                            <Link ellipsis>{to}</Link>
                                        </RouterLink>
                                    </Tooltip>
                                </>
                            }
                        </>
                    }
                </Col>
            </>}
            {isMobile && <>
                <Col span={24}>
                    {
                        <>
                            {OutputActionAndLabel()}
                            <span style={{ marginLeft: "2%" }}></span>
                            <EtherAmount raw={amount} fix={18}></EtherAmount>
                        </>
                    }
                </Col>
                <Col span={24}>
                    <ArrowRightOutlined />
                    <Tooltip title={to}>
                        <RouterLink to={`/address/${to}`}>
                            <Link style={{ maxWidth: "85%", marginLeft: "1%" }} ellipsis>{to}</Link>
                        </RouterLink>
                    </Tooltip>
                </Col>
            </>}
            {
                (lockIds instanceof Array) &&
                lockIds.map(lockId => {
                    return <>
                        {
                            lockId != '0' &&
                            <Col span={24}>
                                <img src={shape} style={{ width: "8px", marginTop: "-2px", marginRight: "4px" }} />
                                <UnlockOutlined />
                                <Text type='secondary' strong delete>[LockID:{lockId}]</Text>
                            </Col>
                        }
                    </>
                })
            }
            {
                lockId != "0" && !(lockIds instanceof Array) &&
                <Col span={24}>
                    <img src={shape} style={{ width: "8px", marginTop: "-2px", marginRight: "4px" }} />
                    <LockOutlined />
                    <Text type='secondary' strong>[LockID:{lockId}]</Text>
                    <Text>
                        {
                            lockDay > 0 &&
                            <>
                                ( {isAddLock && "+"}{lockDay} Days )
                            </>
                        }
                    </Text>
                </Col>
            }
        </Row>
    }

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
                    confirmed == 1 && <Text strong>
                        <Paragraph copyable>{hash}</Paragraph>
                    </Text>
                }
                {
                    (confirmed == 0) && <>
                        <Tooltip title="Confirming">
                            <SyncOutlined spin style={{ float: "left", marginRight: "5px", marginTop: "5px" }} />
                        </Tooltip>
                        <Text underline italic style={{ float: "left" }}>
                            <Paragraph copyable>
                                {hash}
                            </Paragraph>
                        </Text>
                    </>
                }
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
                        { contractInternalTransactions.map(RenderContractInternalTransaction) }
                    </>
                }
            </Col>
        </Row>

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
                                const { transactionHash, from, to, token, tokenPropVO, value } = erc20TransferVO;
                                const erc20Prop = tokenPropVO && tokenPropVO.subType === "erc20" ? tokenPropVO?.prop : undefined;
                                const erc20 = erc20Prop ? JSON.parse(erc20Prop) : undefined;
                                return (<>
                                    <Row style={{ marginTop: "2px" }}>
                                        <Text strong> <CaretRightOutlined /> From</Text>
                                        <RouterLink to={`/address/${from}`} style={{ minWidth: "60px", maxWidth: "15%", marginLeft: "5px" }}>
                                            <Link ellipsis>{from}</Link>
                                        </RouterLink>
                                        <Text strong> To</Text>
                                        <RouterLink to={`/address/${to}`} style={{ minWidth: "60px", maxWidth: "15%", marginLeft: "5px" }}>
                                            <Link ellipsis>{to}</Link>
                                        </RouterLink>
                                        <Text strong style={{ marginRight: "5px" }}> For</Text>
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
            // 节点奖励
            nodeRewards && nodeRewards.length > 0 &&
            <>
                <Divider style={{ margin: '18px 0px' }} />
                <Row>
                    <Col xl={8} xs={24}>
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>Node Rewards:  <Tag color="#77838f">{nodeRewards.length}</Tag></Text>
                    </Col>
                    <Col xl={16} xs={24}>
                        <Row style={{ marginTop: "2px" }}>
                            <Text strong style={{ marginRight: "5px" }}>SuperNode:</Text>
                            {
                                superNode && superNode.propVO &&
                                <Tooltip title={superNode.address}>
                                    <RouterLink to={`/address/${superNode.address}`}>
                                        <Link>{superNode.propVO.tag}</Link>
                                    </RouterLink>
                                </Tooltip>
                            }
                            {
                                superNode && !superNode.propVO &&
                                <RouterLink to={`/address/${superNode.address}`}>
                                    <Link>{superNode.address}</Link>
                                </RouterLink>
                            }
                        </Row>
                        {
                            nodeRewards.filter(nodeReward => nodeReward.nodeType == 1)
                                .map(nodeReward => RenderNodeReward(nodeReward))
                        }
                        <Row style={{ marginTop: "20px" }}>
                            <Text strong style={{ marginRight: "5px" }}>MasterNode:</Text>
                            {
                                masterNode && masterNode.propVO &&
                                <Tooltip title={masterNode.address}>
                                    <RouterLink to={`/address/${masterNode.address}`}>
                                        <Link>{masterNode.propVO.tag}</Link>
                                    </RouterLink>
                                </Tooltip>
                            }
                            {
                                masterNode && !masterNode.propVO &&
                                <RouterLink to={`/address/${masterNode.address}`}>
                                    <Link>{masterNode.address}</Link>
                                </RouterLink>
                            }
                        </Row>
                        {
                            nodeRewards.filter(nodeReward => nodeReward.nodeType == 2)
                                .map(nodeReward => RenderNodeReward(nodeReward))
                        }

                    </Col>
                </Row>
            </>
        }

        {
            // SafeAccountManagerActions 锁仓这种数据.
            safeAccountManagerActions && safeAccountManagerActions.length > 0 &&
            <>
                <Divider style={{ margin: '18px 0px' }} />
                <Row id="safeAccountManagerActions">
                    <Col xl={8} xs={24}>
                        <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <Text strong style={{ marginLeft: "5px" }}>AccountManager Actions</Text>
                    </Col>
                    <Col xl={16} xs={24}>
                        {safeAccountManagerActions.map(RenderSafeAccountManagerAction)}
                    </Col>
                </Row>
            </>
        }

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
                        <Tag>{`Nonce:${nonce}`}</Tag>
                        <Tag>{`Position:${transactionIndex}`}</Tag>
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