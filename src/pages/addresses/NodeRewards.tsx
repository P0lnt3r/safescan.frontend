
import { useCallback, useEffect, useMemo, useState } from "react"
import { NodeRewardVO, TransactionVO } from "../../services";
import { fetchAddressTransactions } from "../../services/tx";
import { PaginationProps, Table, Typography, Row, Col, Tooltip, TablePaginationConfig } from 'antd';
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
import BlockNumber from "../../components/BlockNumber";
import { format } from "../../utils/NumberFormat";

const { Text, Link } = Typography;
const DEFAULT_PAGESIZE = 20;

export default ({ address }: { address: string }) => {

    const { t } = useTranslation();
    
    const [tableData, setTableData] = useState<NodeRewardVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [unconfirmed, setUnconfirmed] = useState<number>(0);
    const [confirmed, setConfirmed] = useState<number>(0);

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        position: ["topRight", "bottomRight"],
        pageSizeOptions: [],
        responsive: true,
    });

    async function doFetchAddressNodeWards() {
        setLoading(true)
        fetchAddressNodeRewards({
            current: pagination.current,
            pageSize: pagination.pageSize,
            address: address
        }).then(data => {
            setLoading(false)
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
                doFetchAddressNodeWards();
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

    useEffect(() => {
        pagination.current = 1;
        pagination.pageSize = 20;
        doFetchAddressNodeWards();
    }, [address]);

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

    const columns: ColumnsType<NodeRewardVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
            dataIndex: 'transactionHash',
            render: (txHash, txVO) => <TransactionHash blockNumber={txVO.blockNumber} txhash={txHash}></TransactionHash>,
            width: 180,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
            dataIndex: 'blockNumber',
            width: 80,
            render: (blockNumber,nodeReward) => <BlockNumber blockNumber={blockNumber} confirmed={nodeReward.confirmed}></BlockNumber>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
            dataIndex: 'timestamp',
            width: 130,
            render: (val) => <>{DateFormat(val * 1000)}</>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Node</Text>,
            dataIndex: 'nodeAddress',
            width: 180,
            render: (nodeAddress, nodeReward) => {
                const hasLink = !(nodeAddress == address);
                const nodeType = nodeReward.nodeType == 1 ? "SuperNode" : "MasterNode"
                return <>
                    <Tooltip title={nodeAddress}>
                        <Text strong style={{ marginRight: "5px" }}>{nodeType}:</Text>
                        {
                            nodeReward.nodeAddressPropVO &&
                            <>
                                {!hasLink && <>{nodeReward.nodeAddressPropVO.tag}</>}
                                {hasLink && <RouterLink to={`address/${nodeAddress}`}>
                                    <Link ellipsis>{nodeReward.nodeAddressPropVO.tag}</Link>
                                </RouterLink>}
                            </>
                        }
                        {
                            !nodeReward.nodeAddressPropVO &&
                            <>
                                {!hasLink && <Text ellipsis>{nodeAddress}</Text>}
                                {hasLink && <RouterLink to={`address/${nodeAddress}`}>
                                    <Link ellipsis>{nodeAddress}</Link>
                                </RouterLink>}
                            </>
                        }
                    </Tooltip>
                </>
            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: 'address',
            width: 180,
            render: (addr, nodeReward) => {
                const hasLink = !(addr == address);
                const rewardType = RewardTypeLabel(nodeReward.rewardType);
                return <>
                    <Tooltip title={addr}>
                        <Text type="secondary" style={{ marginRight: "5px" }}>[{rewardType}]</Text>
                        {
                            nodeReward.addressPropVO &&
                            <>
                                {!hasLink && <>{nodeReward.addressPropVO.tag}</>}
                                {hasLink && <RouterLink to={`address/${addr}`}>
                                    <Link ellipsis>{nodeReward.addressPropVO.tag}</Link>
                                </RouterLink>}
                            </>
                        }
                        {
                            !nodeReward.addressPropVO &&
                            <>
                                {!hasLink && <Text ellipsis>{address}</Text>}
                                {hasLink && <RouterLink to={`address/${addr}`}>
                                    <Link ellipsis>{address}</Link>
                                </RouterLink>}
                            </>
                        }
                    </Tooltip>
                </>
            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Amount</Text>,
            dataIndex: 'amount',
            width: 100,
            render: (value) => <Text strong><EtherAmount raw={value} /></Text>
        }

    ];

    function OutputTotal() {
        return <>
            {
                confirmed != unconfirmed && <Text strong style={{ color: "#6c757e" }}>Total of {
                    confirmed && <>{format(confirmed + "")}</>
                } Node Rewards
                    {unconfirmed > 0 && <Text> and {unconfirmed} unconfirmed</Text>}
                </Text>
            }
        </>
    }

    return <>
        <OutputTotal></OutputTotal>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={(nodeReward: NodeRewardVO) => nodeReward.transactionHash + nodeReward.eventLogIndex}
        />

    </>
}