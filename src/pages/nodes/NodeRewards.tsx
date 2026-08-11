import { useEffect, useState } from "react";
import { NodeRewardVO } from "../../services";
import { Table, Typography, TablePaginationConfig } from "antd";
import type { ColumnsType } from "antd/es/table";
import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import EtherAmount from "../../components/EtherAmount";
import BlockNumber from "../../components/BlockNumber";
import { format } from "../../utils/NumberFormat";
import { fetchNodeRewards } from "../../services/node";
import Address from "../../components/Address";

const { Text } = Typography;
const DEFAULT_PAGESIZE = 10;

export default function NodeRewards({
    address,
    nodeAddress,
}: {
    address?: string;
    nodeAddress?: string;
}) {
    const [tableData, setTableData] = useState<NodeRewardVO[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGESIZE);

    useEffect(() => {
        setCurrent(1);
    }, [address, nodeAddress]);

    useEffect(() => {
        setLoading(true);
        fetchNodeRewards({
            current,
            pageSize,
            address,
            nodeAddress,
        }).then((data) => {
            setLoading(false);
            setTableData(data.records);
            setTotal(data.total);
        });
    }, [address, nodeAddress, current, pageSize]);

    const pagination: TablePaginationConfig = {
        current,
        pageSize,
        total,
        showSizeChanger: true,
        position: ["topRight", "bottomRight"],
    };

    const handlePageChange = (page: number, size?: number) => {
        setCurrent(page);
        if (size) setPageSize(size);
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
            title: <Text strong style={{ color: "#6c757e" }}>Reward Type</Text>,
            dataIndex: "rewardType",
            width: 130,
            render: (rewardType) => (
                <Text type="secondary" style={{ marginRight: "5px" }}>
                    [{RewardTypeLabel(rewardType)}]
                </Text>
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: "address",
            width: 180,
            render: (addr, nodeReward) => (
                <Address address={addr} propVO={nodeReward.addressPropVO} />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Amount</Text>,
            dataIndex: "amount",
            width: 100,
            render: (value) => (
                <Text strong>
                    <EtherAmount raw={value} />
                </Text>
            ),
        },
    ];

    return (
        <>
            {total > 0 && (
                <Text strong style={{ color: "#6c757e" }}>
                    Total of {format(String(total))} Node Rewards
                </Text>
            )}
            <Table
                loading={loading}
                columns={columns}
                dataSource={tableData}
                scroll={{ x: 800 }}
                rowKey={(nodeReward) => nodeReward.transactionHash + nodeReward.address}
                pagination={{
                    ...pagination,
                    onChange: handlePageChange,
                }}
            />
        </>
    );
}
