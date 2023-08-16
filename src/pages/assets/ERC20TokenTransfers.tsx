import { useEffect, useState } from "react"
import { ERC20TransferVO } from "../../services";
import { fetchAddressERC20Transfers, fetchERC20Transfers } from "../../services/tx";
import { Table, Typography, Row, Col, PaginationProps, Tooltip, TablePaginationConfig } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import { Link as RouterLink } from 'react-router-dom';
import ERC20TokenAmount from "../../components/ERC20TokenAmount";
import ERC20Logo from "../../components/ERC20Logo";
import { format } from "../../utils/NumberFormat";

const { Text, Link } = Typography;
const DEFAULT_PAGESIZE = 20;

export default ({ tokenAddress }: { tokenAddress: string }) => {

    const { t } = useTranslation();

    const [tableData, setTableData] = useState<ERC20TransferVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [unconfirmed, setUnconfirmed] = useState<number>(0);
    const [confirmed, setConfirmed] = useState<number>(0);

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        position: ["topRight", "bottomRight"],
        pageSizeOptions: [],
        responsive: true,
    });

    async function doFetchERC20TokenTransactions() {
        setLoading(true)
        fetchERC20Transfers({
            current: pagination.current,
            pageSize: pagination.pageSize,
            tokenAddress: tokenAddress
        }).then(data => {
            setLoading(false)
            setTableData(data.records);
            const unconfirmed = [];
            data.records.forEach(tx => {
                if (tx.confirmed != 1) {
                    unconfirmed.push(tx);
                }
            })
            setConfirmed(data.total);
            setUnconfirmed(unconfirmed.length);
            const onChange = (page: number, pageSize: number) => {
                pagination.pageSize = unconfirmed.length > 0 ? pageSize - unconfirmed.length : pageSize;
                pagination.current = page;
                doFetchERC20TokenTransactions();
            }
            if (pagination.current == 1) {
                const total = data.total;
                const dbSize = data.pageSize;
                const dbPages = Math.floor(total / dbSize);
                const uiTotal = (dbPages * unconfirmed.length) + total;
                setPagination({
                    ...pagination,
                    current: data.current,
                    total: uiTotal,
                    pageSize: data.records.length,
                    onChange: onChange
                })
            } else {
                setPagination({
                    ...pagination,
                    current: data.current,
                    total: data.total,
                    pageSize: data.pageSize,
                    onChange: onChange
                })
            }
        })
    }

    useEffect(() => {
        pagination.current = 1;
        pagination.pageSize = DEFAULT_PAGESIZE;
        doFetchERC20TokenTransactions();
    }, [tokenAddress]);


    const columns: ColumnsType<ERC20TransferVO> = [
        {
            title: <>{t('Txn Hash')}</>,
            dataIndex: 'transactionHash',
            render: (val, txVO) => <><TransactionHash blockNumber={txVO.blockNumber} txhash={val} status={1}></TransactionHash></>,
            width: 180,
            fixed: 'left',
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
            render: (from, txVO) => {
                return (
                    <>
                        <Row>
                            <Col span={20}>
                                <Tooltip title={from}>
                                    {
                                        <RouterLink to={`/address/${from}`}>
                                            <Link style={{ width: "80%" }} ellipsis>{from}</Link>
                                        </RouterLink>
                                    }
                                </Tooltip>
                            </Col>

                        </Row>
                    </>
                )
            }
        },
        {
            title: 'To',
            dataIndex: 'to',
            width: 180,
            render: (to) =>
                <Tooltip title={to}>{
                    <RouterLink to={`/address/${to}`}>
                        <Link style={{ width: "80%", marginLeft: "5px" }} ellipsis>{to}</Link>
                    </RouterLink>
                }</Tooltip>
        },
        {
            title: 'Value',
            dataIndex: 'value',
            width: 100,
            render: (value, erc20TransferVO) => {
                const { tokenPropVO } = erc20TransferVO;
                const erc20Prop = tokenPropVO && tokenPropVO.subType === "erc20" ? tokenPropVO?.prop : undefined;
                const erc20 = erc20Prop ? JSON.parse(erc20Prop) : undefined;
                return (
                    <div style={{ fontSize: '14px' }}>
                        {
                            tokenPropVO &&
                            <ERC20TokenAmount address={tokenPropVO?.address} name={erc20.name} symbol={erc20.symbol} decimals={erc20.decimals} raw={value} fixed={4} />
                        }
                    </div>
                )
            }
        },
        {
            title: 'Token',
            dataIndex: 'value',
            width: 200,
            render: (value, erc20TransferVO) => {
                const { tokenPropVO } = erc20TransferVO;
                const erc20Prop = tokenPropVO && tokenPropVO.subType === "erc20" ? tokenPropVO?.prop : undefined;
                const erc20 = erc20Prop ? JSON.parse(erc20Prop) : undefined;
                return (
                    <div style={{ fontSize: '14px' }}>
                        {
                            tokenPropVO && <>
                                <RouterLink to={`/address/${tokenPropVO.address}`}>
                                    <ERC20Logo address={tokenPropVO.address} />
                                    <Link href='#' ellipsis style={{ width: '80%', marginLeft: "5px" }}>
                                        {erc20.name}({erc20.symbol})
                                    </Link>
                                </RouterLink>
                            </>
                        }
                    </div>
                )
            }
        },
    ];

    function OutputTotal() {
        return <>
            {
                confirmed != unconfirmed && <Text strong style={{ color: "#6c757e" }}>Total of {
                    confirmed && <>{format(confirmed + "")}</>
                } ERC20 Transfers
                    {unconfirmed > 0 && <Text> and {unconfirmed} unconfirmed</Text>}
                </Text>
            }
        </>
    }

    return <>
        <OutputTotal />
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }} loading={loading}
            pagination={pagination} rowKey={(vo) => vo.transactionHash}
        />
    </>

}