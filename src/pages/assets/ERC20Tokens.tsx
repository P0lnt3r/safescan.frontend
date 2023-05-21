

import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO, ERC20TokenVO } from '../../services';
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

const { Title, Text, Link } = Typography;

export default () => {

    function paginationOnChange(page: number, pageSize: number) {
        pagination.current = page;
        doFetchERC20Tokens();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    async function doFetchERC20Tokens() {
        fetchERC20Tokens({
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
    const [tableData, setTableData] = useState<ERC20TokenVO[]>([]);

    useEffect(() => {
        pagination.current = 1;
        doFetchERC20Tokens();
    }, []);

    const columns: ColumnsType<ERC20TokenVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Token</Text>,
            dataIndex: 'address',
            render: (address, vo) => {
                return <>
                    <RouterLink to={`/address/${address}`}>
                        <ERC20Logo address={address} />
                        <Link ellipsis style={{ width: '80%', marginLeft: "5px" }}>
                            {vo.name}({vo.symbol})
                        </Link>
                    </RouterLink>
                </>
            },
            width: 40,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Holders</Text>,
            dataIndex: 'holders',
            render: (holders, vo) => {
                return <>
                    {holders}
                </>
            },
            width: 40,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Transfer Txns</Text>,
            dataIndex: 'totalTransfers',
            render: (totalTransfers, vo) => {
                return <>
                    {totalTransfers}
                </>
            },
            width: 40,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Transfer Amount</Text>,
            dataIndex: 'totalTransferAmount',
            render: (totalTransferAmount, vo) => {
                return <>
                    {
                        totalTransferAmount &&
                        <>
                            <ERC20TokenAmount address={vo.address} name={vo.name} symbol={vo.symbol}
                                raw={totalTransferAmount} fixed={6} decimals={vo.decimals} />
                            <Text style={{marginLeft:"5px"}}>{vo.symbol}</Text>
                        </>
                    }
                </>
            },
            width: 40,
            fixed: 'left',
        },
    ];

    return (<>
        <Title level={3}>ERC20 Tokens</Title>
        <Card>
            <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
                pagination={pagination}
            />
        </Card>
    </>)
}