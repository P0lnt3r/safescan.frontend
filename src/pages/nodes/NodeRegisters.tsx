import { useEffect, useState } from "react";
import { NodeRegisterActionVO } from "../../services";
import { fetchMasternodeRegisterActions, fetchSupernodeRegisterActions } from "../../services/node";
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

export default function NodeRegisters({
    address,
    type,
}: {
    type: string;
    address?: string;
}) {
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState<NodeRegisterActionVO[]>([]);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGESIZE);

    useEffect(() => {
        setCurrent(1);
    }, [address, type]);

    useEffect(() => {
        setLoading(true);
        const fetchPromise =
            type === "masternode"
                ? fetchMasternodeRegisterActions({ current, pageSize, address })
                : fetchSupernodeRegisterActions({ current, pageSize, address });

        fetchPromise.then((data) => {
            setLoading(false);
            setTableData(data.records);
            setTotal(data.total);
        });
    }, [type, address, current, pageSize]);

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

    const columns: ColumnsType<NodeRegisterActionVO> = [
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
            title: <Text strong style={{ color: "#6c757e" }}>Register Method</Text>,
            dataIndex: "registerType",
            render: (val) => <Text ellipsis>{val}</Text>,
            width: 100,
            fixed: "left",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
            dataIndex: "blockNumber",
            width: 70,
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
            title: <Text strong style={{ color: "#6c757e" }}>Founder</Text>,
            dataIndex: "operator",
            width: 150,
            render: (operator, vo) => (
                <Address address={operator} propVO={vo.operatorPropVO} />
            ),
        },
        {
            title: (
                <Text strong style={{ color: "#6c757e" }}>
                    {type === "masternode" ? "Masternode" : "Supernode"}
                </Text>
            ),
            dataIndex: "address",
            width: 150,
            render: (addr, vo) => (
                <Address address={addr} propVO={vo.addressPropVO} />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Amount</Text>,
            dataIndex: "amount",
            width: 80,
            render: (amount) => (
                <Text strong>
                    <EtherAmount raw={amount.toString()} fix={2} />
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
