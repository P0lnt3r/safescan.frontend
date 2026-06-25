import { useEffect, useState } from "react";
import { NodeRewardVO } from "../../services";
import { Table, Typography, TablePaginationConfig } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSearchParams } from "react-router-dom";
import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import EtherAmount from "../../components/EtherAmount";
import { fetchNodeRewards } from "../../services/node";
import BlockNumber from "../../components/BlockNumber";
import { format } from "../../utils/NumberFormat";
import Address from "../../components/Address";

const { Text } = Typography;
const DEFAULT_PAGESIZE = 10;

export default function NodeRewards({ address }: { address: string }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const current = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);

    const [tableData, setTableData] = useState<NodeRewardVO[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetchNodeRewards({ current, pageSize, address }).then((data) => {
            setLoading(false);
            setTableData(data.records);
            setTotal(data.total);
        });
    }, [address, current, pageSize]);

    const handlePageChange = (page: number, size?: number) => {
        const next = new URLSearchParams(searchParams);
        next.set("page", String(page));
        if (size) next.set("pageSize", String(size));
        setSearchParams(next);
    };

    const pagination: TablePaginationConfig = {
        current,
        pageSize,
        total: total,
        showSizeChanger: true,
        position: ["topRight", "bottomRight"],
    };

    const RewardTypeLabel = (rewardType: number) => {
        switch (rewardType) {
            case 1:
                return "Creator";
            case 2:
                return "Founder";
            case 3:
                return "Voter";
        }
    };

    const columns: ColumnsType<NodeRewardVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
            dataIndex: "transactionHash",
            render: (txHash, txVO) => (
                <TransactionHash blockNumber={txVO.blockNumber} txhash={txHash} />
            ),
            width: 180,
            fixed: "left",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
            dataIndex: "blockNumber",
            width: 80,
            render: (blockNumber, nodeReward) => (
                <BlockNumber blockNumber={blockNumber} confirmed={nodeReward.confirmed} />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
            dataIndex: "timestamp",
            width: 130,
            render: (val) => <>{DateFormat(val * 1000)}</>,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Node</Text>,
            dataIndex: "nodeAddress",
            width: 180,
            render: (nodeAddress, nodeReward) => (
                <Address
                    address={nodeAddress}
                    propVO={nodeReward.nodeAddressPropVO}
                    to={`/node/${nodeAddress}`}
                />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Reward Type</Text>,
            dataIndex: "rewardType",
            width: 80,
            render: (rewardType) => (
                <Text type="secondary" style={{ marginRight: "5px" }}>
                    [{RewardTypeLabel(rewardType)}]
                </Text>
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Amount</Text>,
            dataIndex: "amount",
            width: 120,
            render: (value) => (
                <Text strong>
                    <EtherAmount raw={value} fix={8} />
                </Text>
            ),
        },
    ];

    return (
        <>
            {total && (
                <Text strong style={{ color: "#6c757e" }}>
                    Total of {format(String(total))} Node Rewards
                 </Text>
            )}
            <Table
                loading={loading}
                columns={columns}
                dataSource={tableData}
                scroll={{ x: 800 }}
                rowKey={(nodeReward) =>
                    nodeReward.transactionHash +
                    nodeReward.eventLogIndex +
                    nodeReward.amount
                }
                pagination={{
                    ...pagination,
                    onChange: handlePageChange,
                }}
            />
        </>
    );
}
