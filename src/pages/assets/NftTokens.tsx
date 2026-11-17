import { Card, Table, Typography, Tag, TablePaginationConfig } from "antd";
import { useEffect, useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import {
    fetchInsightNftTokens,
    InsightNftTokenVO,
} from "../../services/insight/nft";
import NFT_PLACEHOLDER from "../../images/nft-placeholder.svg";
import { format } from "../../utils/NumberFormat";

const { Title, Text, Link } = Typography;
const DEFAULT_PAGESIZE = 10;

function TokenLogo({ logoURI }: { logoURI: string | null }) {
    const [src, setSrc] = useState(logoURI || NFT_PLACEHOLDER);
    return (
        <img
            src={src}
            alt=""
            width={32}
            height={32}
            onError={() => setSrc(NFT_PLACEHOLDER)}
            style={{
                borderRadius: 8,
                objectFit: "cover",
                flexShrink: 0,
                display: "block",
            }}
        />
    );
}

export default function NftTokensPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const current = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);

    const [allData, setAllData] = useState<InsightNftTokenVO[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchInsightNftTokens()
            .then((tokens) => setAllData(tokens))
            .finally(() => setLoading(false));
    }, []);

    const tableData = useMemo(() => {
        const start = (current - 1) * pageSize;
        return allData.slice(start, start + pageSize);
    }, [allData, current, pageSize]);

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
        total: allData.length,
        showSizeChanger: true,
        showTotal: (t) => <>Total : {t}</>,
        position: ["bottomRight"],
    };

    const columns: ColumnsType<InsightNftTokenVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Token</Text>,
            dataIndex: "address",
            render: (address, vo) => (
                <RouterLink
                    to={`/token/${String(address).toLowerCase()}`}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        maxWidth: "100%",
                    }}
                >
                    <TokenLogo key={vo.address} logoURI={vo.logoURI} />
                    <Link ellipsis style={{ lineHeight: "32px", marginBottom: 0 }}>
                        {vo.name}({vo.symbol})
                    </Link>
                </RouterLink>
            ),
            width: 220,
            fixed: "left",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Type</Text>,
            dataIndex: "type",
            render: (tokenType) => {
                let showText = tokenType;
                if (tokenType === "erc721") showText = "ERC-721";
                if (tokenType === "erc1155") showText = "ERC-1155";
                return (
                    <Tag style={{ height: "30px", lineHeight: "28px", borderRadius: "10px" }}>
                        {showText}
                    </Tag>
                );
            },
            width: 100,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Holders</Text>,
            dataIndex: "holders",
            render: (holders) => <>{format(String(holders))}</>,
            width: 100,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Transfer Txns</Text>,
            dataIndex: "totalTransfers",
            render: (totalTransfers) => <>{format(String(totalTransfers))}</>,
            width: 120,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Total Assets</Text>,
            dataIndex: "totalAssets",
            render: (totalAssets) => <>{format(String(totalAssets))}</>,
            width: 120,
        },
    ];

    return (
        <>
            <Title level={3}>NFT Tokens</Title>
            <Card>
                {allData.length > 0 && (
                    <Text strong style={{ color: "#6c757e" }}>
                        Total of {format(String(allData.length))} NFT Tokens
                    </Text>
                )}
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
