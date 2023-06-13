
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO } from '../../services';
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
import { JSBI } from '@uniswap/sdk';

const { Title, Text, Link } = Typography;

export default () => {

    function paginationOnChange(page: number, pageSize: number) {
        pagination.current = page;
        doFetchAddressTransactions();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    async function doFetchAddressTransactions() {
        fetchAddressBalanceRank({
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
    const [tableData, setTableData] = useState<AddressBalanceRankVO[]>([]);

    useEffect(() => {
        pagination.current = 1;
        doFetchAddressTransactions();
    }, []);

    const columns: ColumnsType<AddressBalanceRankVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Rank</Text>,
            dataIndex: 'rank',
            render: (rank) => <Text strong>{rank}</Text >,
            width: 40,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: 'address',
            render: (address, addressBalanceRankVO: AddressBalanceRankVO) => <>
                {
                    addressBalanceRankVO.addressPropVO?.type == 'contract' &&
                    <>
                        <Tooltip title="Contract"><FileTextOutlined style={{ marginRight: "5px" }} /></Tooltip>
                    </>
                }
                <RouterLink to={`/address/${address}`}>
                    <Link>{address}</Link>
                </RouterLink>
            </>,
            width: 140,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Name Tag</Text>,
            dataIndex: 'addressPropVO',
            render: (addressProp) => <>{addressProp?.tag}</>,
            width: 80,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Balance</Text>,
            dataIndex: 'balance',
            render: (balance, addressBalanceRankVO) => {
                const totalAmount = addressBalanceRankVO.totalAmount;
                const totalBalance = JSBI.add(
                    JSBI.BigInt(balance),
                    JSBI.BigInt(totalAmount)
                ).toString();
                return <>
                    <Text strong><EtherAmount raw={totalBalance} fix={6} /></Text>
                </>
            },
            width: 120,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Percentage</Text>,
            dataIndex: 'percentage',
            render: (percentage) => <Text strong>{percentage}</Text>,
            width: 60,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Txn Count</Text>,
            dataIndex: 'txCount',
            render: (txCount) => <>  {txCount && format(txCount + "")} </>,
            width: 60,
        }
    ];


    return (<>
        <Title level={3}>Top Accounts by SAFE Balance </Title>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={(txVO) => txVO.address}
        />
    </>)

}