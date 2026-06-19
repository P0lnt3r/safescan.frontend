import { useEffect, useMemo, useState } from "react";
import { TransactionVO } from "../../services";
import { fetchAddressTransactions } from "../../services/tx";
import { Table, Typography, Row, Col } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useSearchParams } from "react-router-dom";

import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import EtherAmount from "../../components/EtherAmount";
import TxMethodId from "../../components/TxMethodId";
import BlockNumber from "../../components/BlockNumber";
import Address from "../../components/Address";

const { Text } = Typography;
const DEFAULT_PAGESIZE = 10;

export default ({ address }: { address: string }) => {

    // ================= URL STATE =================
    const [searchParams, setSearchParams] = useSearchParams();

    const current = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);

    // ================= STATE =================
    const [tableData, setTableData] = useState<TransactionVO[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    // ================= URL PAGINATION =================
    const setPage = (page: number, size?: number) => {
        const next = new URLSearchParams(searchParams);

        next.set("page", String(page));
        if (size) next.set("pageSize", String(size));

        setSearchParams(next);
    };

    const pagination: TablePaginationConfig = {
        current,
        pageSize,
        position: ["topRight", "bottomRight"],
        showSizeChanger: true,
    };

    // ================= FETCH =================
    useEffect(() => {
        setLoading(true);

        fetchAddressTransactions({
            current,
            pageSize,
            address,
        }).then((data) => {
            setTableData(data.records);
            setTotal(data.total);
            setLoading(false);
        });
    }, [address, current, pageSize]);

    // ================= COLUMNS =================
    const columns: ColumnsType<TransactionVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
            dataIndex: "hash",
            width: 140,
            fixed: "left",
            render: (val, txVO) => (
                <TransactionHash
                    blockNumber={txVO.blockNumber}
                    txhash={val}
                    status={txVO.status}
                />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Method</Text>,
            dataIndex: "methodId",
            width: 100,
            render: (methodId, txVO) => (
                <TxMethodId
                    methodId={methodId}
                    address={txVO.to}
                    subType={txVO.toPropVO?.subType}
                />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Block</Text>,
            dataIndex: "blockNumber",
            width: 70,
            render: (blockNumber, txVO) => (
                <BlockNumber blockNumber={blockNumber} confirmed={txVO.confirmed} />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
            dataIndex: "timestamp",
            width: 120,
            render: (val) => <>{DateFormat(val * 1000)}</>,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
            dataIndex: "from",
            width: 160,
            render: (from, txVO) => {
                const hasLink = from !== address;

                return (
                    <Row>
                        <Col span={20}>
                            <Address
                                address={from}
                                propVO={txVO.fromPropVO}
                                style={{ hasLink }}
                            />
                        </Col>
                        <Col span={4}>
                            {address === from ? (
                                <Text code strong style={{ color: "orange" }}>OUT</Text>
                            ) : (
                                <Text code strong style={{ color: "green" }}>IN</Text>
                            )}
                        </Col>
                    </Row>
                );
            },
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
            dataIndex: "to",
            width: 150,
            render: (to, txVO) => (
                <Address
                    address={to}
                    propVO={txVO.toPropVO}
                    style={{ hasLink: address !== to }}
                />
            ),
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Value</Text>,
            dataIndex: "value",
            width: 120,
            render: (value) => (
                <Text strong>
                    <EtherAmount raw={value} />
                </Text>
            ),
        },
    ];

    // ================= UI =================
    return (
        <Table
            columns={columns}
            dataSource={tableData}
            rowKey={(txVO) => txVO.hash}
            scroll={{ x: 800 }}
            loading={loading}
            pagination={{
                ...pagination,
                total,
                onChange: setPage,
            }}
        />
    );
};