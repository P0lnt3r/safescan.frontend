import { useEffect, useState } from "react"
import { ERC20TransferVO } from "../../services";
import { fetchAddressERC20Transfers, fetchERC20Transfers } from "../../services/tx";
import { Table, Typography, Row, Col, PaginationProps, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import { Link as RouterLink } from 'react-router-dom';
import ERC20TokenAmount from "../../components/ERC20TokenAmount";
import ERC20Logo from "../../components/ERC20Logo";

const { Text, Link } = Typography;

export default ({ tokenAddress }: { tokenAddress: string }) => {

    const { t } = useTranslation();
    function paginationOnChange(current: number, pageSize: number) {
        pagination.current = current;
        doFetchERC20TokenTransactions();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    const [tableData, setTableData] = useState<ERC20TransferVO[]>([]);


    async function doFetchERC20TokenTransactions() {
        fetchERC20Transfers({
            current: pagination.current,
            pageSize: pagination.pageSize,
            tokenAddress: tokenAddress
        }).then(data => {
            setPagination({
                ...pagination,
                current: data.current,
                pageSize: data.pageSize,
                total: data.total,
                onChange: paginationOnChange,
            })
            setTableData(data.records);
        })
    }

    useEffect(() => {
        pagination.current = 1;
        doFetchERC20TokenTransactions();
    }, [tokenAddress]);

    const columns: ColumnsType<ERC20TransferVO> = [
        {
            title: <>{t('Txn Hash')}</>,
            dataIndex: 'transactionHash',
            render: (val, txVO) => <><TransactionHash txhash={val} status={1}></TransactionHash></>,
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

    return <>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={(vo) => vo.transactionHash}
        />
    </>

}