import { useCallback, useEffect, useMemo, useState } from "react"
import { AccountRecordVO, AddressPropVO, NodeRewardVO, SafeAccountManagerActionVO, TransactionVO } from "../../services";
import { fetchAddressTransactions } from "../../services/tx";
import { PaginationProps, Table, Typography, Row, Col, Tooltip, TableColumnsType, Divider, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import AddressTag, { ShowStyle } from '../../components/AddressTag';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import EtherAmount from '../../components/EtherAmount';
import NavigateLink from "../../components/NavigateLink";
import TxMethodId from "../../components/TxMethodId";

import {
    ArrowRightOutlined,
    FileTextOutlined,
    LockOutlined,
    UnlockOutlined,
    HourglassTwoTone
} from '@ant-design/icons';
import { Link as RouterLink, useParams } from "react-router-dom";
import { JSBI } from "@uniswap/sdk";
import { fetchAccountRecord, fetchAccountRecordById, fetchAddressAccountRecord, fetchSafeAccountManagerActions } from "../../services/accountRecord";
import BlockNumberFormatTime from "../../components/BlockNumberFormatTime";
import { Button } from "antd/lib/radio";
import { FilterValue, SorterResult, TableCurrentDataSource, TablePaginationConfig } from "antd/es/table/interface";
import { DataSourceItemType } from "antd/lib/auto-complete";
import { useBlockNumber } from "../../state/application/hooks";
import Address from "../../components/Address";
import BlockNumber from "../../components/BlockNumber";

const { Text, Link, Title } = Typography;
const DEFAULT_PAGESIZE = 10;
const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

export function RenderAccountRecordAmount(accountRecord: AccountRecordVO, blockNumber: number) {
    const { amount, lockDay, unlockTimestamp, unfreezeHeight, releaseHeight, withdrawHeight, withdrawTimestamp, withdrawTxHash } = accountRecord;
    const hasLock = lockDay > 0;
    const isLocked = hasLock && !unlockTimestamp;
    const isFreezed = (blockNumber < unfreezeHeight || blockNumber < releaseHeight);
    const isWithdrawed = withdrawHeight && withdrawHeight > 0;
    return <>
        {
            isFreezed && <Text strong style={{ color: "rgb(6, 58, 156)" }}>
                <EtherAmount raw={amount} />
            </Text>
        }
        {
            !isFreezed && isLocked && <Text strong type="secondary" >
                <EtherAmount raw={amount} />
            </Text>
        }
        {
            !isFreezed && !isLocked && !isWithdrawed && <Text strong type="success" >
                <EtherAmount raw={amount} />
            </Text>
        }
        {
            isWithdrawed && <>
                <Text delete style={{color:"#dfdfdf"}}>
                    <EtherAmount raw={amount} />
                </Text>
            </>
        }
    </>
}

export function RenderAccountRecordId(accountRecord: AccountRecordVO, blockNumber: number, options?: {
    showID?: boolean,
    hasLink?: boolean
}) {
    const { lockId, unlockTimestamp, lockDay, unfreezeHeight, releaseHeight , withdrawHeight } = accountRecord;
    return <>
        {
            (!unlockTimestamp && lockDay > 0) && <LockOutlined />
        }
        {
            unlockTimestamp && !withdrawHeight && <UnlockOutlined />
        }
        {
            (blockNumber < unfreezeHeight || blockNumber < releaseHeight) &&
            <HourglassTwoTone />
        }
        {
            !options && <>
                <RouterLink to={`/assets/accountRecords/${lockId}`}>
                    <Link strong>{lockId}</Link>
                </RouterLink>
            </>
        }
        {
            options && options.showID && !options.hasLink && <>
                <Text strong>{lockId}</Text>
            </>
        }
        {
            options && options.showID && !options.hasLink && <>
                <RouterLink to={`/assets/accountRecords/${lockId}`}>
                    <Link strong>{lockId}</Link>
                </RouterLink>
            </>
        }
    </>
}

export function RenderAccountRecordUnlockHeight(accountRecord: AccountRecordVO) {
    const unlockHeight = accountRecord.unlockHeight;
    const unlockTimestamp = accountRecord.unlockTimestamp;
    return <>
        <Tooltip title={unlockHeight}>
            {
                !unlockTimestamp && <Text strong type="secondary">
                    <BlockNumberFormatTime blockNumber={unlockHeight} />
                </Text>
            }
            {
                unlockTimestamp &&
                <Text type="success" strong>{DateFormat(unlockTimestamp * 1000)}</Text>
            }
        </Tooltip>
    </>
}

function RenderMemberOfNode(accountRecord: AccountRecordVO) {
    const {
        specialAddress, nodeAddressPropVO, registerAction, registerActionTxHash,
        freezeHeight, freezeTimestamp, unfreezeHeight, unfreezeTimestamp,
        withdrawTxHash
    } = accountRecord;
    const isEmpty = !specialAddress || EMPTY_ADDRESS == specialAddress || withdrawTxHash != null;
    return <>
        <Row>
            <Col span={6}>
                <Text strong>Node:</Text>
            </Col>
            <Col span={18}>
                {
                    isEmpty && <Text type="secondary">[EMPTY]</Text>
                }
                {
                    !isEmpty && <Address address={specialAddress} propVO={nodeAddressPropVO} />
                }
            </Col>
        </Row>
        <Row>
            <Col span={6}>
                <Text strong>Txn:</Text>
            </Col>
            <Col span={18}>
                {
                    registerActionTxHash && <TransactionHash txhash={registerActionTxHash}></TransactionHash>
                }
                {
                    !isEmpty && !registerActionTxHash && <Text strong>GENESIS</Text>
                }
            </Col>
        </Row >
        <Row>
            <Col span={6}>
                <Text strong>Unfreeze:</Text>
            </Col>
            <Col span={18}>
                <Tooltip title={unfreezeHeight}>
                    {
                        !unfreezeTimestamp &&
                        <Text strong style={{ color: "rgb(6, 58, 156)" }}>
                            <BlockNumberFormatTime blockNumber={unfreezeHeight} />
                        </Text>
                    }
                    {
                        unfreezeTimestamp &&
                        <Text type="success" strong>{DateFormat(unfreezeTimestamp * 1000)}</Text>
                    }
                </Tooltip>
            </Col>
        </Row>
    </>
}

function RenderVoteForNode(accountRecord: AccountRecordVO) {
    const {
        votedAddress, votedAddressPropVO, voteAction, voteActionTxHash,
        voteHeight, voteTimestamp, releaseHeight, releaseTimestamp,
        withdrawTxHash
    } = accountRecord;
    const isEmpty = !votedAddress || EMPTY_ADDRESS == votedAddress || withdrawTxHash != null ;
    return <>
        <Row>
            <Col span={6}>
                <Text strong>Node:</Text>
            </Col>
            <Col span={18}>
                {
                    isEmpty && <Text type="secondary">[EMPTY]</Text>
                }
                {
                    !isEmpty && <Address address={votedAddress} propVO={votedAddressPropVO} />
                }
            </Col>
        </Row>
        <Row>
            <Col span={6}>
                <Text strong>Txn:</Text>
            </Col>
            <Col span={18}>
                {
                    voteActionTxHash && !isEmpty &&
                    <TransactionHash txhash={voteActionTxHash}></TransactionHash>
                }
            </Col>
        </Row>
        <Row>
            <Col span={6}>
                <Text strong>Unfreeze:</Text>
            </Col>
            <Col span={18}>
                <Tooltip title={releaseHeight}>
                    {
                        !releaseTimestamp && !isEmpty &&
                        <Text strong style={{ color: "rgb(6, 58, 156)" }}>
                            <BlockNumberFormatTime blockNumber={releaseHeight} />
                        </Text>
                    }
                    {
                        releaseTimestamp && !isEmpty &&
                        <Text type="success">{DateFormat(releaseTimestamp * 1000)}</Text>
                    }
                </Tooltip>
            </Col>
        </Row>
    </>
}


export default () => {

    const { recordId } = useParams();
    const [tableData, setTableData] = useState<SafeAccountManagerActionVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [unconfirmed, setUnconfirmed] = useState<number>(0);
    const [confirmed, setConfirmed] = useState<number>(0);
    const [accountRecord, setAccountRecord] = useState<AccountRecordVO>();
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        position: ["bottomRight"],
        pageSizeOptions: [],
        responsive: true,
    });
    const blockNumber = useBlockNumber();

    function doFetchSafeManagerActions() {
        setLoading(true)
        if (recordId) {
            fetchSafeAccountManagerActions({
                current: pagination.current,
                pageSize: pagination.pageSize,
                recordId
            }).then(data => {
                setLoading(false);
                setTableData(data.records);
                const unconfirmed = [];
                data.records.forEach(tx => {
                    if (tx.confirmed != 1) {
                        unconfirmed.push(tx);
                    }
                })
                setConfirmed(data.total);
                setUnconfirmed(unconfirmed.length);
                const onChange = (page: number, pageSize: number) => {
                    pagination.pageSize = unconfirmed.length > 0 ? pageSize - unconfirmed.length : pageSize;
                    pagination.current = page;
                    doFetchSafeManagerActions();
                }
                if (pagination.current == 1) {
                    const total = data.total;
                    const dbSize = data.pageSize;
                    const dbPages = Math.floor(total / dbSize);
                    const uiTotal = (dbPages * unconfirmed.length) + total;
                    setPagination({
                        ...pagination,
                        current: data.current,
                        total: uiTotal,
                        pageSize: data.records.length,
                        onChange: onChange
                    })
                } else {
                    setPagination({
                        ...pagination,
                        current: data.current,
                        total: data.total,
                        pageSize: data.pageSize,
                        onChange: onChange
                    })
                }
            })
        }
    }

    useEffect(() => {
        pagination.current = 1;
        pagination.pageSize = DEFAULT_PAGESIZE;
        doFetchSafeManagerActions();
        if (recordId) {
            fetchAccountRecordById(recordId).then(data => {
                setAccountRecord(data)
            })
        }
    }, [recordId]);

    const columns: ColumnsType<SafeAccountManagerActionVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
            dataIndex: 'transactionHash',
            render: (val, txVO) => <><TransactionHash blockNumber={txVO.blockNumber} txhash={val}></TransactionHash></>,
            width: 180,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Block Number</Text>,
            dataIndex: 'blockNumber',
            width: 130,
            render: (val, vo) => <BlockNumber blockNumber={val} confirmed={vo.confirmed}></BlockNumber>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
            dataIndex: 'timestamp',
            width: 130,
            render: (val) => <>{DateFormat(val * 1000)}</>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Action</Text>,
            dataIndex: 'action',
            width: 130,
            render: (val) => <> {val} </>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Effects</Text>,
            dataIndex: 'lockDay',
            width: 130,
            render: (val, vo) => RenderEffects(vo.action, vo.lockDay)
        },
    ];

    function RenderEffects(action: string, days: number) {
        const lockActions = ["SafeDeposit", "SafeAddLockDay"];
        const freezeActions = ["SafeVote", "SafeFreeze"];

        const type = lockActions.indexOf(action) >= 0 ? "Lock" :
            freezeActions.indexOf(action) >= 0 ? "Freeze" : action;
        return <>
            {type == "Lock" && <>
                <Tooltip title="Lock">
                    <LockOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }} type="secondary">{days} days</Text>
            </>}
            {type == "Freeze" && <>
                <Tooltip title="Freeze">
                    <HourglassTwoTone />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px", color: "rgb(6, 58, 156)" }} type="secondary">{days} days</Text>
            </>}
        </>
    }

    return <>
        <Row>
            <Title level={3}>AccountRecord</Title>
            <Text type="secondary" style={{ lineHeight: "34px", marginLeft: "5px", fontSize: "18px" }}>#{recordId}</Text>
        </Row>
        <Row>
            <Col span={8} style={{ padding: "10px" }}>
                <Card>
                    <Row>
                        <Text strong>Overviews</Text>
                    </Row>
                    <Divider style={{ marginTop: "12px" }} />
                    <Row>
                        <Col span={6}>
                            <Text strong>Owner:</Text>
                        </Col>
                        <Col span={18}>
                            {
                                accountRecord && <Address address={accountRecord.address} />
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Text strong>Amount:</Text>
                        </Col>
                        <Col span={18}>
                            {
                                accountRecord?.amount && <>
                                    {RenderAccountRecordId(accountRecord, blockNumber, { showID: false })}
                                    <span style={{ marginRight: "5px" }}></span>
                                    {RenderAccountRecordAmount(accountRecord, blockNumber)}
                                </>
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Text strong>Unlock:</Text>
                        </Col>
                        <Col span={18}>
                            {
                                accountRecord && <>
                                    {RenderAccountRecordUnlockHeight(accountRecord)}
                                </>
                            }
                        </Col>
                    </Row>
                    {
                        accountRecord && accountRecord.withdrawTimestamp &&
                        <Row>
                            <Col span={6}>
                                <Text strong>Withdraw:</Text>
                            </Col>
                            <Col span={18}>
                                {
                                    accountRecord && <Text strong underline>
                                        <Tooltip title={accountRecord.withdrawHeight}>
                                            <RouterLink to={`/tx/${accountRecord.withdrawTxHash}`}>
                                                <Text>
                                                    {DateFormat(accountRecord.withdrawTimestamp * 1000)}
                                                </Text>
                                            </RouterLink>
                                        </Tooltip>
                                    </Text>
                                }
                            </Col>
                        </Row>
                    }
                </Card>
            </Col>
            <Col span={8} style={{ padding: "10px" }}>
                <Card>
                    <Row>
                        <Text strong>Member Of Node</Text>
                    </Row>
                    <Divider style={{ marginTop: "12px" }} />
                    {
                        accountRecord && RenderMemberOfNode(accountRecord)
                    }
                </Card>
            </Col>
            <Col span={8} style={{ padding: "10px" }}>
                <Card>
                    <Row>
                        <Text strong>Vote For Supernode</Text>
                    </Row>
                    <Divider style={{ marginTop: "12px" }} />
                    {
                        accountRecord && RenderVoteForNode(accountRecord)
                    }
                </Card>
            </Col>
        </Row>
        <Divider />

        <Card>
            <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }} loading={loading}
                pagination={pagination} rowKey={(vo) => vo.transactionHash}
            />
        </Card>

    </>
}