
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
import { ArrowRightOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link as RouterLink } from "react-router-dom";
import { JSBI } from "@uniswap/sdk";
import { fetchAddressNodeRewards } from "../../services/node";
import { fetchAddressAccountRecord } from "../../services/accountRecord";

const { Text, Link } = Typography;
const { Column, ColumnGroup } = Table;

interface ExpandedAccountRecordDataType {
    key: React.Key
    transactionHash: string
    action: string
    nodeAddress: string,
    nodeAddressPropVO: AddressPropVO
    freezeHeight: number,
    unfreezeHeight: number
}

export default ({ address }: { address: string }) => {
    const { t } = useTranslation();
    function paginationOnChange(page: number, pageSize: number) {
        pagination.current = page;
        doFetchAddressAccountRecords();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    const [tableData, setTableData] = useState<AccountRecordVO[]>([]);

    async function doFetchAddressAccountRecords() {
        fetchAddressAccountRecord({
            current: pagination.current,
            pageSize: pagination.pageSize,
            address: address
        }).then(data => {
            setPagination({
                ...pagination,
                current: data.current,
                pageSize: data.pageSize,
                total: data.total,
                onChange: paginationOnChange,
            })
            setTableData(data.records);
        })
    }

    useEffect(() => {
        pagination.current = 1;
        doFetchAddressAccountRecords();
    }, [address]);

    const expandedRowRender = (accountRecord: AccountRecordVO) => {
        const {
            sepcialAddress, nodeAddressPropVO, freezeHeight, unfreezeHeight,
            votedAddress, votedAddressPropVO, voteHeight, releaseHeight
        } = accountRecord;
        const columns: TableColumnsType<ExpandedAccountRecordDataType> = [
            { title: 'Action', dataIndex: 'action', key: 'action', width: 50 },
            {
                title: 'Transaction Hash', dataIndex: 'transactionHash', width: 20,
                render: (transactionHash) => {
                    return <div>
                        <TransactionHash txhash={transactionHash} sub={5}></TransactionHash>
                    </div>
                },
            },
            {
                title: "Node", dataIndex: "nodeAddress", width: 20,
                render: (nodeAddress, expandedAccountRecord) => {
                    const hasLink = !(nodeAddress == address);
                    return <>
                        <Tooltip title={nodeAddress}>
                            {
                                expandedAccountRecord.nodeAddressPropVO &&
                                <>
                                    {!hasLink && <>{accountRecord.nodeAddressPropVO.tag}</>}
                                    {hasLink && <RouterLink to={`/address/${nodeAddress}`}>
                                        <Link ellipsis>{accountRecord.nodeAddressPropVO.tag}</Link>
                                    </RouterLink>}
                                </>
                            }
                            {
                                !expandedAccountRecord.nodeAddressPropVO &&
                                <>
                                    {!hasLink && <Text ellipsis>{nodeAddress}</Text>}
                                    {hasLink && <RouterLink to={`/address/${nodeAddress}`}>
                                        <Link ellipsis>{nodeAddress}</Link>
                                    </RouterLink>}
                                </>
                            }
                        </Tooltip>
                    </>
                },
            },
            {
                title: 'Freeze', dataIndex: 'freezeHeight', render: (freezeHeight) => {
                    return <>{freezeHeight} <Divider type="vertical" />2020-12-12 12:12:12</>
                }
            },
            {
                title: 'Unfreeze', dataIndex: 'unfreezeHeight', render: (unfreezeHeight) => {
                    return <>{unfreezeHeight} <Divider type="vertical" />2020-12-12 12:12:12</>
                }
            },
        ];
        const data = [];
        if (sepcialAddress) {
            data.push({
                key: "",
                transactionHash: "0x0000000000000000000000000000000000000000",
                action: "SNRegister",
                nodeAddress: sepcialAddress,
                nodeAddressPropVO,
                freezeHeight,
                unfreezeHeight
            });
        }
        if (votedAddress) {
            data.push({
                key: "",
                transactionHash: "0x0000000000000000000000000000000000000000",
                action: "Vote",
                nodeAddress: votedAddress,
                nodeAddressPropVO: votedAddressPropVO,
                freezeHeight: voteHeight,
                unfreezeHeight: releaseHeight
            })
        }
        return <Table columns={columns} dataSource={data} pagination={false} />;
    };

    return <>

        <Table dataSource={tableData} scroll={{ x: 800 }}
            expandable={{ expandedRowRender }}
            pagination={pagination} rowKey={(accountRecord: AccountRecordVO) => accountRecord.lockId}>
            <Column title={<Text strong style={{ color: "#6c757e" }}>ID</Text>}
                dataIndex="lockId"
                render={(lockId) => {
                    return <>{lockId}</>
                }}
                width={20}
                fixed
            />
            <Column title={<Text strong style={{ color: "#6c757e" }}>Amount</Text>}
                dataIndex="amount"
                render={(amount) => {
                    return <Text strong><EtherAmount raw={amount} /></Text>
                }}
                width={80}
            />

            <Column title={<Text strong style={{ color: "#6c757e" }}>Member Of Node</Text>}
                dataIndex="sepcialAddress"
                render={(sepcialAddress, accountRecord: AccountRecordVO) => {
                    const hasLink = !(sepcialAddress == address);
                    return <>
                        <Tooltip title={sepcialAddress}>
                            {
                                accountRecord.nodeAddressPropVO &&
                                <>
                                    {!hasLink && <>{accountRecord.nodeAddressPropVO.tag}</>}
                                    {hasLink && <RouterLink to={`address/${sepcialAddress}`}>
                                        <Link ellipsis>{accountRecord.nodeAddressPropVO.tag}</Link>
                                    </RouterLink>}
                                </>
                            }
                            {
                                !accountRecord.nodeAddressPropVO &&
                                <>
                                    {!hasLink && <Text ellipsis>{sepcialAddress}</Text>}
                                    {hasLink && <RouterLink to={`address/${sepcialAddress}`}>
                                        <Link ellipsis>{sepcialAddress}</Link>
                                    </RouterLink>}
                                </>
                            }
                        </Tooltip>
                    </>
                }}
                width={80}
            />
            <Column title={<Text strong style={{ color: "#6c757e" }}>Proxy MasterNode</Text>}
                dataIndex=""
                render={() => {
                    return <>{ }</>
                }}
                width={80}
            />
            <Column title={<Text strong style={{ color: "#6c757e" }}>Vote For Node</Text>}
                dataIndex="votedAddress"
                render={(votedAddress, accountRecord: AccountRecordVO) => {
                    const hasLink = !(votedAddress == address);
                    return <>
                        <Tooltip title={votedAddress}>
                            {
                                accountRecord.votedAddressPropVO &&
                                <>
                                    {!hasLink && <>{accountRecord.nodeAddressPropVO.tag}</>}
                                    {hasLink && <RouterLink to={`address/${votedAddress}`}>
                                        <Link ellipsis>{accountRecord.votedAddressPropVO.tag}</Link>
                                    </RouterLink>}
                                </>
                            }
                            {
                                !accountRecord.votedAddressPropVO &&
                                <>
                                    {!hasLink && <Text ellipsis>{votedAddress}</Text>}
                                    {hasLink && <RouterLink to={`address/${votedAddress}`}>
                                        <Link ellipsis>{votedAddress}</Link>
                                    </RouterLink>}
                                </>
                            }
                        </Tooltip>
                    </>
                }}
                width={80}
            />

            <Column title={<Text strong style={{ color: "#6c757e" }}>Start</Text>}
                dataIndex="startHeight"
                render={(startHeight) => {
                    return <>{startHeight} <Divider type="vertical" /> 2020-12-12 12:12:12</>
                }}
                width={100}
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
                render={(unlockHeight) => {
                    return <>{unlockHeight}<Divider type="vertical" /> 2020-12-12 12:12:12</>
                }}
                width={100}
            />

        </Table>

    </>
}