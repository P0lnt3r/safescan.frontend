import { useEffect, useState } from "react"
import { ERC20TransferVO } from "../../services";
import { fetchAddressERC20Transfers } from "../../services/tx";
import { Table, Typography, Row, Col, PaginationProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import AddressTag, { ShowStyle } from '../../components/AddressTag';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import { Link as RouterLink } from 'react-router-dom';
import ERC20TokenAmount from "../../components/ERC20TokenAmount";

const { Text, Link } = Typography;

export default ({ address }: { address: string }) => {
    const { t } = useTranslation();

    async function doFetchAddressTransactions() {
        fetchAddressERC20Transfers({
            current: pagination.current,
            pageSize: pagination.pageSize,
            address: address
        }).then(data => {
            setPagination({
                current: data.current,
                pageSize: data.pageSize,
                total: data.total,
                ...pagination
            })
            setTableData(data.records);
        })
    }

    function paginationOnChange(current: number, pageSize: number) {
        pagination.current = current;
        doFetchAddressTransactions();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    const [tableData, setTableData] = useState<ERC20TransferVO[]>([]);

    useEffect(() => {
        doFetchAddressTransactions();
    }, [address]);

    const columns: ColumnsType<ERC20TransferVO> = [
        {
            title: <>{t('Txn Hash')}</>,
            dataIndex: 'transactionHash',
            render: (val, txVO) => <><TransactionHash txhash={val} sub={8} status={1}></TransactionHash></>,
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
            render: (val) => <>
                <Row>
                    <Col span={20}>
                        {
                            address === val
                                ? <AddressTag address={val} sub={8} showStyle={ShowStyle.NO_LINK} />
                                : <AddressTag address={val} sub={8} />
                        }
                    </Col>
                    <Col span={4}>
                        {
                            address === val
                                ? <Text code strong style={{ color: "orange" }}>OUT</Text>
                                : <Text code strong style={{ color: "green" }}>IN</Text>
                        }
                    </Col>
                </Row>
            </>
        },
        {
            title: 'To',
            dataIndex: 'to',
            width: 180,
            render: (val) => <>{
                address === val
                    ? <AddressTag address={val} sub={8} showStyle={ShowStyle.NO_LINK} />
                    : <AddressTag address={val} sub={8} />
            }</>
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
            width: 100,
            render: (value, erc20TransferVO) => {
                const { tokenPropVO } = erc20TransferVO;
                const erc20Prop = tokenPropVO && tokenPropVO.subType === "erc20" ? tokenPropVO?.prop : undefined;
                const erc20 = erc20Prop ? JSON.parse(erc20Prop) : undefined;
                return (
                    <div style={{ fontSize: '14px' }}>
                        {
                            tokenPropVO && <>
                                <RouterLink to={`/address/${tokenPropVO.address}`}>
                                    <Link href='#' ellipsis style={{ width: '80%', marginLeft: "5px" }}>
                                        <Text>{erc20.name}</Text>
                                        (<Text>{erc20.symbol}</Text>)
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