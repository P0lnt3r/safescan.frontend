import { Table, Typography, Progress } from "antd";
import { useEffect, useState } from "react";
import { fetchAddressBalanceRank } from "../../services/address";
import { AddressBalanceRankVO } from "../../services";
import type { ColumnsType } from "antd/es/table";
import ERC20TokenAmount from "../../components/ERC20TokenAmount";
import Address from "../../components/Address";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

const DEFAULT_PAGESIZE = 20;

export default ({ token }: { token: string }) => {
    const { t } = useTranslation();

    const [tableData, setTableData] = useState<AddressBalanceRankVO[]>([]);
    const [loading, setLoading] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    // =========================
    // URL 状态（核心）
    // =========================
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);
    const [total, setTotal] = useState(0);

    // =========================
    // fetch（纯函数）
    // =========================
    async function loadData(current: number, size: number) {
        setLoading(true);
        try {
            const data = await fetchAddressBalanceRank({
                current,
                pageSize: size,
                token
            });
            setTableData(data.records);
            setTotal(data.total);
        } finally {
            setLoading(false);
        }
    }

    // =========================
    // effect（依赖 URL）
    // =========================
    useEffect(() => {
        loadData(page, pageSize);
    }, [token, page, pageSize]);

    // =========================
    // columns
    // =========================
    const columns: ColumnsType<AddressBalanceRankVO> = [
        {
            title: (
                <Text strong style={{ color: "#6c757e" }}>
                    Rank
                </Text>
            ),
            dataIndex: "rank",
            width: 60,
            render: (rank) => <Text strong>{rank}</Text>
        },
        {
            title: "Address",
            dataIndex: "address",
            width: 220,
            render: (address, vo) => (
                <Address
                    address={address}
                    propVO={vo.addressPropVO}
                    style={{ ellipsis: false, hasLink: true }}
                />
            )
        },
        {
            title: "Balance",
            dataIndex: "balance",
            width: 160,
            render: (balance, vo) => {
                const tokenPropVO = vo.tokenPropVO;

                if (!tokenPropVO) return null;

                const erc20 =
                    tokenPropVO.prop && tokenPropVO.subType === "erc20"
                        ? JSON.parse(tokenPropVO.prop)
                        : undefined;

                return (
                    <Text strong>
                        <ERC20TokenAmount
                            address={tokenPropVO.address}
                            name={erc20?.name}
                            symbol={erc20?.symbol}
                            decimals={erc20?.decimals}
                            raw={balance}
                            fixed={erc20?.decimals}
                        />
                        <span style={{ marginLeft: 5 }}>
                            {erc20?.symbol}
                        </span>
                    </Text>
                );
            }
        },
        {
            title: "Percentage",
            dataIndex: "percentage",
            width: 140,
            render: (percentage: string) => {
                const percentValue = Number(
                    percentage?.replace("%", "") || 0
                );

                return (
                    <>
                        <Text>{percentage}</Text>
                        <Progress
                            percent={percentValue}
                            showInfo={false}
                            size="small"
                        />
                    </>
                );
            }
        }
    ];

    return (
        <Table
            columns={columns}
            dataSource={tableData}
            loading={loading}
            scroll={{ x: 800 }}
            rowKey={(vo) => vo.address}
            pagination={{
                current: page,
                pageSize: pageSize,
                showSizeChanger: true,
                total: total,
                position: ["topRight", "bottomRight"],
                onChange: (p, ps) => {
                    setSearchParams({
                        page: String(p),
                        pageSize: String(ps)
                    });
                }
            }}
        />
    );
};