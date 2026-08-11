import { useEffect, useState } from "react";
import { SNVoteActionVO } from "../../services";
import { fetchSNVoteActions } from "../../services/node";
import { TablePaginationConfig, Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import TransactionHash from "../../components/TransactionHash";
import { Link as RouterLink } from "react-router-dom";
import { DateFormat } from "../../utils/DateUtil";
import Address from "../../components/Address";
import EtherAmount from "../../components/EtherAmount";
import BlockNumber from "../../components/BlockNumber";

const { Text, Link } = Typography;
const DEFAULT_PAGESIZE = 10;

export default function SupernodesVoteActions({ address }: { address?: string }) {
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState<SNVoteActionVO[]>([]);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGESIZE);

    useEffect(() => {
        setCurrent(1);
    }, [address]);

    useEffect(() => {
        setLoading(true);
        fetchSNVoteActions({ current, pageSize, address }).then((data) => {
            setLoading(false);
            setTableData(data.records);
            setTotal(data.total);
        });
    }, [address, current, pageSize]);

    const pagination: TablePaginationConfig = {
        current,
        pageSize,
        total,
        showSizeChanger: true,
        position: ["bottomRight"],
    };

    const handlePageChange = (page: number, size?: number) => {
        setCurrent(page);
        if (size) setPageSize(size);
    };

    const columns: ColumnsType<SNVoteActionVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
            dataIndex: "transactionHash",
            render: (val, vo) => (
                <TransactionHash blockNumber={vo.blockNumber} txhash={val} />
            ),
            width: 120,
            fixed: "left",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Action</Text>,
            dataIndex: "action",
            render: (val) => <Text ellipsis>{val}</Text>,
            width: 80,
            fixed: "left",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
            dataIndex: "blockNumber",
            width: 80,
            render: (blockNumber, vo) => (
                <BlockNumber blockNumber={blockNumber} confirmed={vo.confirmed} />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
            dataIndex: "timestamp",
            width: 120,
            render: (val) => <>{DateFormat(val * 1000)}</>,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Voter</Text>,
            dataIndex: "voterAddress",
            width: 150,
            render: (voter, vo) => (
                <Address address={voter} propVO={vo.voterAddressPropVO} />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Supernode</Text>,
            dataIndex: "targetAddress",
            width: 150,
            render: (targetAddress, vo) => (
                <Address address={targetAddress} propVO={vo.targetAddressPropVO} />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Votes Cast</Text>,
            dataIndex: "amountWeight",
            width: 80,
            render: (amount) => (
                <Text strong>
                    <EtherAmount raw={amount.toString()} fix={2} ignoreLabel />
                </Text>
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Record ID</Text>,
            dataIndex: "lockId",
            width: 60,
            render: (lockId) => (
                <RouterLink to={`/assets/accountRecords/${lockId}`}>
                    <Link strong>{lockId}</Link>
                </RouterLink>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={tableData}
            scroll={{ x: 800 }}
            rowKey={(vo) => vo.transactionHash + vo.eventLogIndex}
            loading={loading}
            pagination={{
                ...pagination,
                onChange: handlePageChange,
            }}
        />
    );
}
