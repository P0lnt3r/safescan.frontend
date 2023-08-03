
import { useCallback, useEffect, useMemo, useState } from "react"
import { AccountRecordVO, AddressPropVO, NodeRewardVO, TransactionVO } from "../../services";
import { fetchAddressTransactions } from "../../services/tx";
import { PaginationProps, Table, Typography, Row, Col, Tooltip, TableColumnsType, Divider } from 'antd';
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
import { Link as RouterLink } from "react-router-dom";
import { JSBI } from "@uniswap/sdk";
import { fetchAddressNodeRewards } from "../../services/node";
import { fetchAddressAccountRecord } from "../../services/accountRecord";
import BlockNumberFormatTime from "../../components/BlockNumberFormatTime";
import { Button } from "antd/lib/radio";
import { FilterValue, SorterResult, TableCurrentDataSource, TablePaginationConfig } from "antd/es/table/interface";
import { DataSourceItemType } from "antd/lib/auto-complete";
import { useBlockNumber } from "../../state/application/hooks";
import Address from "../../components/Address";
import AccountRecords from "../assets/AccountRecords";

const { Text, Link } = Typography;
const { Column, ColumnGroup } = Table;
const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

interface ExpandedAccountRecordDataType {
    key: React.Key,
    type: string,
    transactionHash: string
    action: string
    nodeAddress: string,
    nodeAddressPropVO: AddressPropVO
    freezeHeight: number,
    freezeTimestamp: number,
    unfreezeHeight: number
    unfreezeTimestamp: number
}
const DEFAULT_PAGESIZE = 10;

export default ({ address }: { address: string }) => {

    const { t } = useTranslation();
    const blockNumber = useBlockNumber();

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        position: ["topRight", "bottomRight"],
        pageSizeOptions: [],
        responsive: true,
    });
    const [tableData, setTableData] = useState<AccountRecordVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [tableQueryParams, setTableQueryParams] = useState<{
        orderProp?: string | undefined,
        orderMode?: string | undefined
    }>({});

    async function doFetchAddressAccountRecords() {
        setLoading(true);
        fetchAddressAccountRecord({
            current: pagination.current,
            pageSize: pagination.pageSize,
            orderProp: tableQueryParams.orderProp,
            orderMode: tableQueryParams.orderMode,
            address: address
        }).then(data => {
            setLoading(false);
            setPagination({
                ...pagination,
                current: data.current,
                pageSize: data.pageSize,
                total: data.total,
            })
            setTableData(data.records);
        })
    }

    useEffect(() => {
        pagination.current = 1;
        doFetchAddressAccountRecords();
    }, [address]);

    const handleTableOnChange = (page: TablePaginationConfig, filter: any, sorter: any) => {
        let _sorter = sorter as SorterResult<AccountRecordVO>
        const { field, order } = _sorter;
        tableQueryParams.orderMode = order?.toString();
        tableQueryParams.orderProp = field?.toString();
        if (!order) {
            tableQueryParams.orderMode = undefined;
            tableQueryParams.orderProp = undefined;
        }
        pagination.current = page.current;
        pagination.pageSize = page.pageSize
        doFetchAddressAccountRecords();
    }

    const expandedRowRender = (accountRecord: AccountRecordVO) => {
        const columns: TableColumnsType<ExpandedAccountRecordDataType> = [
            {
                title: 'Type', dataIndex: 'type', key: 'type', width: 150, render: (type) => {
                    return <>
                        <Text strong style={{ color: "#6c757e" }}>{type}</Text>
                    </>
                }
            },
            { title: 'Action', dataIndex: 'action', key: 'action', width: 150 },
            {
                title: 'Transaction Hash', dataIndex: 'transactionHash', width: 400,
                render: (transactionHash) => {
                    const txHashRender = () => {
                        if (transactionHash && transactionHash == EMPTY_ADDRESS) {
                            return <Text strong>GENESIS</Text>
                        }
                        return <TransactionHash txhash={transactionHash} ></TransactionHash>
                    }
                    return txHashRender();
                },
            },
            {
                title: "Node", dataIndex: "nodeAddress", width: 200,
                render: (nodeAddress, expandedAccountRecord) => {
                    const hasLink = !(nodeAddress == address);
                    return <>
                        <Address address={nodeAddress} propVO={expandedAccountRecord.nodeAddressPropVO} style={{hasLink}} />
                    </>
                },
            },
            {
                title: 'Date Time', dataIndex: 'freezeHeight', render: (freezeHeight, vo) => {
                    return <>
                        <Tooltip title={freezeHeight}>
                            {
                                DateFormat(vo.freezeTimestamp * 1000)
                            }
                        </Tooltip>
                    </>
                }
            },
            {
                title: 'Unfreeze', dataIndex: 'unfreezeHeight', render: (unfreezeHeight, expandedAccountRecord) => {
                    const unfreezeTimestamp = expandedAccountRecord.unfreezeTimestamp;
                    return <>
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
                    </>
                }
            },
        ];
        const {
            specialAddress, nodeAddressPropVO, registerAction, registerActionTxHash,
            freezeHeight, freezeTimestamp, unfreezeHeight, unfreezeTimestamp,

            proxyMasternode, proxyAddressPropVO, proxyAction, proxyActionTxHash,
            proxyHeight, proxyTimestamp,

            votedAddress, votedAddressPropVO, voteAction, voteActionTxHash,
            voteHeight, voteTimestamp, releaseHeight, releaseTimestamp

        } = accountRecord;
        const data: ExpandedAccountRecordDataType[] = [];
        if (specialAddress != EMPTY_ADDRESS) {
            data.push({
                key: "",
                type: "Member",
                transactionHash: registerActionTxHash ? registerActionTxHash : EMPTY_ADDRESS,
                action: registerAction,
                nodeAddress: specialAddress,
                nodeAddressPropVO,
                freezeHeight,
                freezeTimestamp,
                unfreezeHeight,
                unfreezeTimestamp
            });
        }
        if (votedAddress != EMPTY_ADDRESS) {
            data.push({
                key: "",
                type: "Vote",
                transactionHash: voteActionTxHash,
                action: voteAction,
                nodeAddress: votedAddress,
                nodeAddressPropVO: votedAddressPropVO,
                freezeHeight: voteHeight,
                freezeTimestamp: voteTimestamp,
                unfreezeHeight: releaseHeight,
                unfreezeTimestamp: releaseTimestamp
            })
        }
        if (proxyMasternode != undefined && proxyMasternode != EMPTY_ADDRESS) {
            data.push({
                key: "",
                type: "Proxy",
                transactionHash: proxyActionTxHash,
                action: proxyAction,
                nodeAddress: proxyMasternode,
                nodeAddressPropVO: proxyAddressPropVO,
                freezeHeight: proxyHeight,
                freezeTimestamp: proxyTimestamp,
                unfreezeHeight: 0,
                unfreezeTimestamp: 0
            });
        }
        return <Table columns={columns} dataSource={data} pagination={false} />;
    };

    return <>
        <Button onClick={() => {
            pagination.current = 1;
            doFetchAddressAccountRecords();
        }}>Refresh</Button>
        <Table dataSource={tableData} scroll={{ x: 800 }}
            expandable={{
                expandedRowRender, rowExpandable: (accountRecordVO) => {
                    const {
                        specialAddress,
                        proxyMasternode,
                        votedAddress
                    } = accountRecordVO;
                    return (
                        (specialAddress != undefined && specialAddress != EMPTY_ADDRESS)
                        || (proxyMasternode != undefined && proxyMasternode != EMPTY_ADDRESS)
                        || (votedAddress != undefined && votedAddress != EMPTY_ADDRESS)
                    )
                }
            }}
            loading={loading}
            onChange={handleTableOnChange}
            pagination={pagination} rowKey={(accountRecord: AccountRecordVO) => accountRecord.lockId}>
            <Column title={<Text strong style={{ color: "#6c757e" }}>ID</Text>}
                dataIndex="lockId"
                render={(lockId, accountRecord: AccountRecordVO) => {
                    const { unlockTimestamp, withdrawTimestamp, lockDay, unfreezeHeight, releaseHeight } = accountRecord;
                    return <>
                        {
                            (!unlockTimestamp && lockDay > 0) && <LockOutlined />
                        }
                        {
                            unlockTimestamp && <UnlockOutlined />
                        }
                        {
                            (blockNumber < unfreezeHeight || blockNumber < releaseHeight) &&
                            <HourglassTwoTone />
                        }
                        {lockId}
                    </>
                }}
                sorter
                width={60}
                fixed
            />
            <Column title={<Text strong style={{ color: "#6c757e" }}>Amount</Text>}
                dataIndex="amount"
                render={(amount, accountRecord: AccountRecordVO) => {
                    const { lockDay, unlockTimestamp, unfreezeHeight, releaseHeight } = accountRecord;
                    const hasLock = lockDay > 0;
                    const isLocked = hasLock && !unlockTimestamp;
                    const isFreezed = (blockNumber < unfreezeHeight || blockNumber < releaseHeight);
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
                            !isFreezed && !isLocked && <Text strong type="success" >
                                <EtherAmount raw={amount} />
                            </Text>
                        }
                    </>
                }}
                width={80}
                sorter
            />
            <Column title={<Text strong style={{ color: "#6c757e" }}>Member Of Node</Text>}
                dataIndex="specialAddress"
                render={(specialAddress, accountRecord: AccountRecordVO) => {
                    const isEmpty = specialAddress == EMPTY_ADDRESS;
                    const hasLink = !(specialAddress == address);
                    return <>
                        {
                            isEmpty && <Text type="secondary">[EMPTY]</Text>
                        }
                        {
                            !isEmpty && <Address address={specialAddress} propVO={accountRecord.nodeAddressPropVO} style={{hasLink}} />
                        }
                    </>
                }}
                width={80}
            />
            <Column title={<Text strong style={{ color: "#6c757e" }}>Proxy MasterNode</Text>}
                dataIndex="proxyMasternode"
                render={(proxyMasternode, accountRecord: AccountRecordVO) => {
                    const isEmpty = proxyMasternode == undefined || proxyMasternode == EMPTY_ADDRESS;
                    const hasLink = !(proxyMasternode == address);
                    return <>
                        {
                            isEmpty && <Text type="secondary">[EMPTY]</Text>
                        }
                        {
                            !isEmpty && <Address address={proxyMasternode} propVO={accountRecord.proxyAddressPropVO} style={{hasLink}} />
                        }
                    </>
                }}
                width={80}
            />
            <Column title={<Text strong style={{ color: "#6c757e" }}>Vote For Node</Text>}
                dataIndex="votedAddress"
                render={(votedAddress, accountRecord: AccountRecordVO) => {
                    const isEmpty = votedAddress == EMPTY_ADDRESS;
                    const hasLink = !(votedAddress == address);
                    return <>
                        {
                            isEmpty && <Text type="secondary">[EMPTY]</Text>
                        }
                        {
                            !isEmpty && <Address address={votedAddress} propVO={accountRecord.votedAddressPropVO} style={{hasLink}} />
                        }
                    </>
                }}
                width={80}
            />

            <Column title={<Text strong style={{ color: "#6c757e" }}>Lock Time</Text>}
                dataIndex="startHeight"
                render={(startHeight, accountRecord: AccountRecordVO) => {
                    return <>
                        <Tooltip title={startHeight}>
                            <RouterLink to={`/tx/${accountRecord.startTxHash}`}>
                                <Link ellipsis>{DateFormat(accountRecord.startTimestamp * 1000)}</Link>
                            </RouterLink>
                        </Tooltip>
                    </>
                }}
                width={80}
            />
            <Column title={<Text strong style={{ color: "#6c757e" }}>Lock Day</Text>}
                dataIndex="lockDay"
                render={(lockDay) => {
                    return <Text>{lockDay}</Text>
                }}
                width={40}
            />
            <Column title={<Text strong style={{ color: "#6c757e" }}>Unlock</Text>}
                dataIndex="unlockHeight"
                render={(unlockHeight, accountRecord: AccountRecordVO) => {
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
                }}
                width={80}
            />
        </Table>

    </>
}