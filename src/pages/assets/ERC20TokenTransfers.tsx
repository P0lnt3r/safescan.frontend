import { useEffect, useState } from "react";
import { ERC20TransferVO } from "../../services";
import { fetchERC20Transfers } from "../../services/tx";
import {
    Table,
    Typography,
    Row,
    Col,
    TablePaginationConfig
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import TransactionHash from "../../components/TransactionHash";
import { DateFormat } from "../../utils/DateUtil";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import ERC20TokenAmount from "../../components/ERC20TokenAmount";
import ERC20Logo from "../../components/ERC20Logo";
import { format } from "../../utils/NumberFormat";
import Address from "../../components/Address";

const { Text, Link } = Typography;
const DEFAULT_PAGESIZE = 20;

export default function ERC20TransferTable({
    tokenAddress,
    filterAddress
}: {
    tokenAddress?: string;
    filterAddress?: string;
}) {
    const { t } = useTranslation();
    const [tableData, setTableData] = useState<ERC20TransferVO[]>([]);
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(0);
    const [unconfirmed, setUnconfirmed] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    // ========================
    // URL 作为唯一分页状态
    // ========================
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);

    // ========================
    // 数据请求（纯函数）
    // ========================
    async function loadData(current: number, size: number) {
        setLoading(true);
        try {
            const data = await fetchERC20Transfers({
                current,
                pageSize: size,
                tokenAddress,
                address: filterAddress
            });
            setTableData(data.records);
            const unconfirmedCount = data.records.filter(
                (tx) => tx.confirmed !== 1
            ).length;
            setConfirmed(data.total);
            setUnconfirmed(unconfirmedCount);
        } finally {
            setLoading(false);
        }
    }

    // ========================
    // effect：依赖 URL + token
    // ========================
    useEffect(() => {
        loadData(page, pageSize);
    }, [tokenAddress, page, pageSize]);

    // ========================
    // columns
    // ========================
    const columns: ColumnsType<ERC20TransferVO> = [
        {
            title: "Tx Hash",
            dataIndex: "transactionHash",
            width: 180,
            fixed: "left",
            render: (val, txVO) => (
                <TransactionHash
                    blockNumber={txVO.blockNumber}
                    txhash={val}
                    status={1}
                />
            )
        },
        {
            title: "Date Time",
            dataIndex: "timestamp",
            width: 130,
            render: (val) => DateFormat(val * 1000)
        },
        {
            title: "From",
            dataIndex: "from",
            width: 180,
            render: (from, txVO) => (
                <Row>
                    <Col span={20}>
                        <Address address={from} propVO={txVO.fromPropVO} />
                    </Col>
                    <Col span={4}>
                        {from === filterAddress ? (
                            <Text code strong style={{ color: "orange" }}>
                                OUT
                            </Text>
                        ) : (
                            <Text code strong style={{ color: "green" }}>
                                IN
                            </Text>
                        )}
                    </Col>
                </Row>
            )
        },
        {
            title: "To",
            dataIndex: "to",
            width: 180,
            render: (to, txVO) => (
                <Address address={to} propVO={txVO.toPropVO} />
            )
        },
        {
            title: "Value",
            dataIndex: "value",
            width: 120,
            render: (value, vo) => {
                const tokenPropVO = vo.tokenPropVO;

                if (!tokenPropVO) return null;

                const erc20 =
                    tokenPropVO?.prop &&
                    tokenPropVO.subType === "erc20"
                        ? JSON.parse(tokenPropVO.prop)
                        : undefined;

                return (
                    <ERC20TokenAmount
                        address={tokenPropVO.address}
                        name={erc20?.name}
                        symbol={erc20?.symbol}
                        decimals={erc20?.decimals}
                        raw={value}
                        fixed={4}
                    />
                );
            }
        },
        {
            title: "Token",
            dataIndex: "token",
            width: 220,
            render: (_, vo) => {
                const tokenPropVO = vo.tokenPropVO;
                if (!tokenPropVO) return null;
                const erc20 =
                    tokenPropVO.prop && tokenPropVO.subType === "erc20"
                        ? JSON.parse(tokenPropVO.prop)
                        : undefined;
                return (
                    <RouterLink to={`/address/${tokenPropVO.address}`}>
                        <ERC20Logo address={tokenPropVO.address} />
                        <Link style={{ marginLeft: 6 }}>
                            {erc20?.name} ({erc20?.symbol})
                        </Link>
                    </RouterLink>
                );
            }
        }
    ];

    // ========================
    // total display
    // ========================
    const OutputTotal = () => (
        <Text strong style={{ color: "#6c757e" }}>
            Total of {format(String(confirmed))} ERC20 Transfers
            {unconfirmed > 0 && (
                <Text> and {unconfirmed} unconfirmed</Text>
            )}
        </Text>
    );

    return (
        <>
            <OutputTotal />
            <Table
                columns={columns}
                dataSource={tableData}
                loading={loading}
                scroll={{ x: 800 }}
                rowKey={(vo) =>
                    vo.transactionHash + "_" + vo.eventLogIndex
                }
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: confirmed,
                    showSizeChanger: true,
                    position: ["topRight", "bottomRight"]
                }}
                onChange={(pagination) => {
                    setSearchParams({
                        page: String(pagination.current),
                        pageSize: String(pagination.pageSize)
                    });
                }}
            />
        </>
    );
}