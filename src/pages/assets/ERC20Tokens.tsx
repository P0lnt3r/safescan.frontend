import { Card, Table, Typography, TablePaginationConfig } from "antd";
import { useEffect, useState } from "react";
import { ERC20TokenVO } from "../../services";
import type { ColumnsType } from "antd/es/table";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { fetchERC20Tokens } from "../../services/assets";
import ERC20Logo from "../../components/ERC20Logo";

const { Title, Text, Link } = Typography;
const DEFAULT_PAGESIZE = 10;

export default function ERC20TokensPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const current = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);

    const [tableData, setTableData] = useState<ERC20TokenVO[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetchERC20Tokens({ current, pageSize }).then((data) => {
            setLoading(false);
            setTableData(data.records);
            setTotal(data.total);
        });
    }, [current, pageSize]);

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
        showTotal: (t) => <>Total : {t}</>,
        position: ["bottomRight"],
    };

    const columns: ColumnsType<ERC20TokenVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Token</Text>,
            dataIndex: "address",
            render: (address, vo) => (
                <RouterLink to={`/token/${address}`}>
                    <ERC20Logo address={address} />
                    <Link ellipsis style={{ width: "80%", marginLeft: "5px" }}>
                        {vo.name}({vo.symbol})
                    </Link>
                </RouterLink>
            ),
            width: 40,
            fixed: "left",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Holders</Text>,
            dataIndex: "holders",
            render: (holders) => <>{holders}</>,
            width: 40,
            fixed: "left",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Transfer Txns</Text>,
            dataIndex: "totalTransfers",
            render: (totalTransfers) => <>{totalTransfers}</>,
            width: 40,
            fixed: "left",
        },
    ];

    return (
        <>
            <Title level={3}>SRC20 Tokens</Title>
            <Card>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    scroll={{ x: 800 }}
                    loading={loading}
                    rowKey={(vo) => vo.address}
                    pagination={{
                        ...pagination,
                        onChange: handlePageChange,
                    }}
                />
            </Card>
        </>
    );
}
