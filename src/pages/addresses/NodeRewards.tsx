
import { useCallback, useEffect, useMemo, useState } from "react"
import { NodeRewardVO, TransactionVO } from "../../services";
import { fetchAddressTransactions } from "../../services/tx";
import { PaginationProps, Table, Typography, Row, Col, Tooltip } from 'antd';
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

const { Text, Link } = Typography;

export default ({ address }: { address: string }) => {
    const { t } = useTranslation();
    function paginationOnChange(page: number, pageSize: number) {
        pagination.current = page;
        doFetchAddressNodeWards();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    const [tableData, setTableData] = useState<NodeRewardVO[]>([]);

    async function doFetchAddressNodeWards() {
        fetchAddressNodeRewards({
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
            render: (txHash, txVO) => <TransactionHash txhash={txHash} sub={8}></TransactionHash>,
            width: 180,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
            dataIndex: 'blockNumber',
            width: 80,
            render: blockNumber => <NavigateLink path={`/block/${blockNumber}`}>{blockNumber}</NavigateLink>
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

    return <>

        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={(nodeReward: NodeRewardVO) => nodeReward.transactionHash + nodeReward.eventLogIndex}
        />

    </>
}