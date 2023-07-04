
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
import BlockNumberFormatTime from "../../components/BlockNumberFormatTime";
import { Button } from "antd/lib/radio";

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
    freezeTimestamp : number,
    unfreezeHeight: number
    unfreezeTimestamp : number
}
const DEFAULT_PAGESIZE = 20;

export default ({ address }: { address: string }) => {

    const { t } = useTranslation();

    
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    const [tableData, setTableData] = useState<AccountRecordVO[]>([]);
    const [loading , setLoading] = useState<boolean>(false);
    function paginationOnChange(page: number, pageSize: number) {
        pagination.current = page;
        doFetchAddressAccountRecords();
    }

    async function doFetchAddressAccountRecords() {
        setLoading(true);
        fetchAddressAccountRecord({
            current: pagination.current,
            pageSize: pagination.pageSize,
            address: address
        }).then(data => {
            setLoading(false);
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
            specialAddress, nodeAddressPropVO, freezeHeight,freezeTimestamp, unfreezeHeight,unfreezeTimestamp,
            votedAddress, votedAddressPropVO, voteHeight, releaseHeight
        } = accountRecord;
        const columns: TableColumnsType<ExpandedAccountRecordDataType> = [
            { title: 'Type', dataIndex: 'type', key: 'type', width: 150 , render : (type) => {
                return <>
                    <Text strong style={{ color: "#6c757e" }}>{type}</Text>
                </>
            } },
            { title: 'Action', dataIndex: 'action', key: 'action', width: 150 },
            {
                title: 'Transaction Hash', dataIndex: 'transactionHash', width: 400,
                render: (transactionHash) => {
                    const txHashRender = () => {
                        if ( transactionHash && transactionHash == EMPTY_ADDRESS ){
                            return <Text strong>GENESIS</Text>
                        }
                        return <TransactionHash txhash={transactionHash} sub={5}></TransactionHash>
                    }
                    return txHashRender();
                },
            },
            {
                title: "Node", dataIndex: "nodeAddress", width: 200,
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
                title: 'Freeze', dataIndex: 'freezeHeight', render: (freezeHeight , vo) => {
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
                title: 'Unfreeze', dataIndex: 'unfreezeHeight', render: (unfreezeHeight) => {
                    return <BlockNumberFormatTime blockNumber={unfreezeHeight}></BlockNumberFormatTime>
                }
            },
        ];
        const data : ExpandedAccountRecordDataType[] = [];
        if (specialAddress != EMPTY_ADDRESS) {
            data.push({
                key: "",
                type: "Member of Node",
                transactionHash: "0x0000000000000000000000000000000000000000",
                action: "SNRegister",
                nodeAddress: specialAddress,
                nodeAddressPropVO,
                freezeHeight,
                freezeTimestamp,
                unfreezeHeight,
                unfreezeTimestamp
            });
        }
        // if (votedAddress != EMPTY_ADDRESS) {
        //     data.push({
        //         key: "",
        //         transactionHash: "0x0000000000000000000000000000000000000000",
        //         action: "Vote",
        //         nodeAddress: votedAddress,
        //         nodeAddressPropVO: votedAddressPropVO,
        //         freezeHeight: voteHeight,
        //         unfreezeHeight: releaseHeight
        //     })
        // }
        return <Table columns={columns} dataSource={data} pagination={false} />;
    };

    return <>
        <Button onClick={() => {
            pagination.current = 1;
            doFetchAddressAccountRecords();
        }}>Refresh</Button>
        <Table dataSource={tableData} scroll={{ x: 800 }}
            expandable={{ expandedRowRender }}
            loading = { loading }
            pagination={pagination} rowKey={(accountRecord: AccountRecordVO) => accountRecord.lockId}>
            <Column title={<Text strong style={{ color: "#6c757e" }}>Lock ID</Text>}
                dataIndex="lockId"
                render={(lockId) => {
                    return <>{lockId}</>
                }}
                width={40}
                fixed
            />
            <Column title={<Text strong style={{ color: "#6c757e" }}>Amount</Text>}
                dataIndex="amount"
                render={(amount) => {
                    return <Text strong><EtherAmount raw={amount} /></Text>
                }}
                width={110}
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
                            !isEmpty &&
                            <Tooltip title={specialAddress}>
                                {
                                    accountRecord.nodeAddressPropVO &&
                                    <>
                                        {!hasLink && <>{accountRecord.nodeAddressPropVO.tag}</>}
                                        {hasLink && <RouterLink to={`address/${specialAddress}`}>
                                            <Link ellipsis>{accountRecord.nodeAddressPropVO.tag}</Link>
                                        </RouterLink>}
                                    </>
                                }
                                {
                                    !accountRecord.nodeAddressPropVO &&
                                    <>
                                        {!hasLink && <Text ellipsis>{specialAddress}</Text>}
                                        {hasLink && <RouterLink to={`address/${specialAddress}`}>
                                            <Link ellipsis>{specialAddress}</Link>
                                        </RouterLink>}
                                    </>
                                }
                            </Tooltip>
                        }
                    </>
                }}
                width={70}
            />
            <Column title={<Text strong style={{ color: "#6c757e" }}>Proxy MasterNode</Text>}
                dataIndex=""
                render={() => {
                    return <>
                        <Text type="secondary">[EMPTY]</Text>
                    </>
                }}
                width={70}
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
                            !isEmpty &&
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
                        }
                    </>
                }}
                width={70}
            />

            <Column title={<Text strong style={{ color: "#6c757e" }}>Lock Time</Text>}
                dataIndex="startHeight"
                render={(startHeight, accountRecord: AccountRecordVO) => {
                    return <>
                        <Tooltip title={startHeight}>
                            <Text>{DateFormat(accountRecord.startTimestamp * 1000)}</Text>
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
                render={(unlockHeight) => {
                    return <>
                        <Tooltip title={unlockHeight}>
                            <BlockNumberFormatTime blockNumber={unlockHeight} />
                        </Tooltip>
                    </>
                }}
                width={80}
            />
        </Table>

    </>
}