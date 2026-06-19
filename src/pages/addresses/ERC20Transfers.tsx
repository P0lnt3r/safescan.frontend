import { useEffect, useMemo, useState } from "react"
import { ERC20TransferVO } from "../../services";
import { fetchAddressERC20Transfers } from "../../services/tx";
import { Table, Typography, Row, Col, Tooltip } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from "react-router-dom";
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import { Link as RouterLink } from 'react-router-dom';
import ERC20TokenAmount from "../../components/ERC20TokenAmount";
import ERC20Logo from "../../components/ERC20Logo";
import { format } from "../../utils/NumberFormat";

const { Text, Link } = Typography;
const DEFAULT_PAGESIZE = 20;

export default ({ address }: { address: string }) => {

    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();

    const current = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);

    const [tableData, setTableData] = useState<ERC20TransferVO[]>([]);
    const [loading, setLoading] = useState(false);

    const [unconfirmed, setUnconfirmed] = useState<number>(0);
    const [confirmed, setConfirmed] = useState<number>(0);

    // ================= FETCH =================
    useEffect(() => {
        setLoading(true);

        fetchAddressERC20Transfers({
            current,
            pageSize,
            address,
        }).then((data) => {
            setLoading(false);
            setTableData(data.records);

            const uc: ERC20TransferVO[] = [];
            data.records.forEach(tx => {
                if (tx.confirmed != 1) uc.push(tx);
            });

            setConfirmed(data.total);
            setUnconfirmed(uc.length);
        });

    }, [address, current, pageSize]);

    // ================= URL PAGINATION =================
    const handlePageChange = (page: number, size?: number) => {
        const next = new URLSearchParams(searchParams.toString());

        next.set("page", String(page));
        if (size) next.set("pageSize", String(size));

        setSearchParams(next);
    };

    const pagination: TablePaginationConfig = {
        current,
        pageSize,
        total: confirmed,
        showSizeChanger: true,
        position: ["topRight", "bottomRight"],
    };

    // ================= COLUMNS =================
    const columns: ColumnsType<ERC20TransferVO> = [
        {
            title: <>{t('Txn Hash')}</>,
            dataIndex: 'transactionHash',
            width: 180,
            fixed: 'left',
            render: (val, txVO) => (
                <TransactionHash
                    blockNumber={txVO.blockNumber}
                    txhash={val}
                    status={1}
                />
            ),
        },
        {
            title: 'Date Time',
            dataIndex: 'timestamp',
            width: 130,
            render: (val) => <>{DateFormat(val * 1000)}</>
        },
        {
            title: "From",
            dataIndex: 'from',
            width: 180,
            render: (from) => (
                <Row>
                    <Col span={20}>
                        <Tooltip title={from}>
                            {address === from ? (
                                <Text ellipsis>{from}</Text>
                            ) : (
                                <RouterLink to={`/address/${from}`}>
                                    <Link ellipsis>{from}</Link>
                                </RouterLink>
                            )}
                        </Tooltip>
                    </Col>
                    <Col span={4}>
                        {address === from ? (
                            <Text code strong style={{ color: "orange" }}>OUT</Text>
                        ) : (
                            <Text code strong style={{ color: "green" }}>IN</Text>
                        )}
                    </Col>
                </Row>
            )
        },
        {
            title: 'To',
            dataIndex: 'to',
            width: 180,
            render: (to) => (
                <Tooltip title={to}>
                    {address === to ? (
                        <Text ellipsis>{to}</Text>
                    ) : (
                        <RouterLink to={`/address/${to}`}>
                            <Link ellipsis>{to}</Link>
                        </RouterLink>
                    )}
                </Tooltip>
            )
        },
        {
            title: 'Value',
            dataIndex: 'value',
            width: 100,
            render: (value, vo) => {
                const tokenPropVO = vo.tokenPropVO;
                const erc20Prop = tokenPropVO?.subType === "erc20"
                    ? tokenPropVO?.prop
                    : undefined;

                const erc20 = erc20Prop ? JSON.parse(erc20Prop) : undefined;

                return (
                    <div>
                        {tokenPropVO && erc20 && (
                            <ERC20TokenAmount
                                address={tokenPropVO.address}
                                name={erc20.name}
                                symbol={erc20.symbol}
                                decimals={erc20.decimals}
                                raw={value}
                                fixed={4}
                            />
                        )}
                    </div>
                );
            }
        },
        {
            title: 'Token',
            dataIndex: 'value',
            width: 200,
            render: (_, vo) => {
                const tokenPropVO = vo.tokenPropVO;
                const erc20Prop = tokenPropVO?.subType === "erc20"
                    ? tokenPropVO?.prop
                    : undefined;

                const erc20 = erc20Prop ? JSON.parse(erc20Prop) : undefined;

                return (
                    <div>
                        {tokenPropVO && erc20 && (
                            <RouterLink to={`/token/${tokenPropVO.address}`}>
                                <ERC20Logo address={tokenPropVO.address} />
                                <Link style={{ marginLeft: 5 }}>
                                    {erc20.name}({erc20.symbol})
                                </Link>
                            </RouterLink>
                        )}
                    </div>
                );
            }
        },
    ];

    // ================= UI =================
    return (
        <>
            <Text strong style={{ color: "#6c757e" }}>
                Total of {format(String(confirmed))} ERC20 Transfers
                {unconfirmed > 0 && (
                    <Text> and {unconfirmed} unconfirmed</Text>
                )}
            </Text>

            <Table
                columns={columns}
                dataSource={tableData}
                scroll={{ x: 800 }}
                loading={loading}
                rowKey={(vo) => vo.transactionHash + vo.eventLogIndex}
                pagination={{
                    ...pagination,
                    onChange: handlePageChange,
                }}
            />
        </>
    );
};