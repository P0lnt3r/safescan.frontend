import { useEffect, useMemo, useState } from "react";
import { NftTransferVO } from "../../services";
import { fetchNftTransfers } from "../../services/tx";
import { Table, Typography, TablePaginationConfig, Card, Divider } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSearchParams } from "react-router-dom";
import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import { format } from "../../utils/NumberFormat";
import TxMethodId from "../../components/TxMethodId";
import Address from "../../components/Address";

const { Text } = Typography;
const DEFAULT_PAGESIZE = 20;

export default function NftTransfers({
    token,
    tokenId,
    tokenType,
}: {
    token: string;
    tokenId: string;
    tokenType: string;
}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const current = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);

    const [tableData, setTableData] = useState<NftTransferVO[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [unconfirmed, setUnconfirmed] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetchNftTransfers({
            current,
            pageSize,
            token,
            tokenId,
        }).then((data) => {
            setLoading(false);
            setTableData(data.records);
            setTotal(data.total);
            setUnconfirmed(data.records.filter((tx) => tx.confirmed !== 1).length);
        });
    }, [token, tokenId, current, pageSize]);

    const handlePageChange = (page: number, size?: number) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("page", String(page));
            if (size) next.set("pageSize", String(size));
            return next;
        });
    };

    const pagination: TablePaginationConfig = {
        current,
        pageSize,
        total,
        showSizeChanger: true,
        position: ["topRight", "bottomRight"],
    };

    const columns: ColumnsType<NftTransferVO> = useMemo(() => {
        const cols: ColumnsType<NftTransferVO> = [
            {
                title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
                dataIndex: "transactionHash",
                render: (val, txVO) => (
                    <TransactionHash blockNumber={txVO.blockNumber} txhash={val} status={1} />
                ),
                width: 120,
                fixed: "left",
            },
            {
                title: <Text strong style={{ color: "#6c757e" }}>Method ID</Text>,
                dataIndex: "methodId",
                width: 120,
                render: (methodId, vo) => (
                    <TxMethodId
                        methodId={methodId}
                        address={vo.toContract}
                        subType={vo.toContractPropVO?.subType}
                    />
                ),
            },
            {
                title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
                dataIndex: "timestamp",
                width: 150,
                render: (val) => <>{DateFormat(val * 1000)}</>,
            },
            {
                title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
                dataIndex: "from",
                width: 150,
                render: (from, txVO) => (
                    <Address address={from} propVO={txVO.fromPropVO} />
                ),
            },
            {
                title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
                dataIndex: "to",
                width: 150,
                render: (to, vo) => <Address address={to} propVO={vo.toPropVO} />,
            },
        ];

        if (tokenType === "erc1155") {
            cols.push({
                title: <Text strong style={{ color: "#6c757e" }}>Value</Text>,
                dataIndex: "tokenValue",
                width: 150,
                render: (tokenValue) => <>{tokenValue}</>,
            });
        }

        return cols;
    }, [tokenType]);

    return (
        <>
            <Divider style={{ marginTop: "20px" }} />
            <Card title="NFT Transfers">
                {total > 0 && (
                    <Text strong style={{ color: "#6c757e" }}>
                        Total of {format(String(total))} NFT Transfers
                        {unconfirmed > 0 && <Text> and {unconfirmed} unconfirmed</Text>}
                    </Text>
                )}
                <Table
                    columns={columns}
                    dataSource={tableData}
                    scroll={{ x: 800 }}
                    loading={loading}
                    rowKey={(vo) => vo.transactionHash + vo.tokenId + vo.tokenValue}
                    pagination={{
                        ...pagination,
                        onChange: handlePageChange,
                    }}
                />
            </Card>
        </>
    );
}
