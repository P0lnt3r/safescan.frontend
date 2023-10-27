
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO, ERC20TokenVO, ERC20TransferVO } from '../../services';
import type { ColumnsType } from 'antd/es/table';
import EtherAmount from '../../components/EtherAmount';
import { Link as RouterLink } from 'react-router-dom';
import {
    UserOutlined,
    FileTextOutlined,
    SafetyOutlined,
    ApartmentOutlined
} from '@ant-design/icons';
import { format } from '../../utils/NumberFormat';
import { fetchERC20Tokens } from '../../services/assets';
import ERC20Logo from '../../components/ERC20Logo';
import ERC20TokenAmount from '../../components/ERC20TokenAmount';
import { fetchERC20Transfers, fetchTransactions } from '../../services/tx';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import Address from '../../components/Address';

const { Title, Text, Link } = Typography;

export default () => {

    function paginationOnChange(page: number, pageSize: number) {
        pagination.current = page;
        doFetchERC20Transfers();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    async function doFetchERC20Transfers() {
        fetchERC20Transfers({
            current: pagination.current,
            pageSize: pagination.pageSize,
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
    const [tableData, setTableData] = useState<ERC20TransferVO[]>([]);

    useEffect(() => {
        pagination.current = 1;
        doFetchERC20Transfers();
    }, []);

    const columns: ColumnsType<ERC20TransferVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Tx Hash</Text>,
            dataIndex: 'transactionHash',
            render: (val, txVO) => <><TransactionHash txhash={val} status={1}></TransactionHash></>,
            width: 180,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Tx Time</Text>,
            dataIndex: 'timestamp',
            width: 130,
            render: (val) => <>{DateFormat(val * 1000)}</>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
            dataIndex: 'from',
            width: 180,
            render: (from, txVO) => {
                return (
                    <>
                        <Address address={from} propVO={txVO.fromPropVO} />
                    </>
                )
            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
            dataIndex: 'to',
            width: 180,
            render: (to , txVO) => <Address address={to} propVO={txVO.toPropVO} />
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Value</Text>,
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
            title:<Text strong style={{ color: "#6c757e" }}>Token</Text>,
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

    return (<>
        <Title level={3}>ERC20 Token Transfers</Title>
        <Card>
            <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
                pagination={pagination}
            />
        </Card>
    </>)
}