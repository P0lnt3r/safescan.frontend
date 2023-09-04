

import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO, ERC20TokenVO, NftTokenVO } from '../../services';
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
import { fetchERC20Tokens, fetchNftTokens } from '../../services/assets';
import ERC20Logo from '../../components/ERC20Logo';
import ERC20TokenAmount from '../../components/ERC20TokenAmount';

const { Title, Text, Link } = Typography;

export default () => {

    function paginationOnChange(page: number, pageSize: number) {
        pagination.current = page;
        doFetchNftTokens();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    async function doFetchNftTokens() {
        fetchNftTokens({
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
    const [tableData, setTableData] = useState<NftTokenVO[]>([]);

    useEffect(() => {
        pagination.current = 1;
        doFetchNftTokens();
    }, []);

    const columns: ColumnsType<NftTokenVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Token</Text>,
            dataIndex: 'address',
            render: (address, vo) => {
                return <>
                    <RouterLink to={`/token/${address}`}>
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
            title: <Text strong style={{ color: "#6c757e" }}>Type</Text>,
            dataIndex: 'type',
            render: (tokenType, vo) => {
                let showText = tokenType;
                if (tokenType == "erc721") {
                    showText = "ERC-721"
                }
                if (tokenType == "erc1155") {
                    showText = "ERC-1155"
                }
                return <>
                    <Tag style={{
                        height: "30px", lineHeight: "28px", borderRadius: "10px"
                    }}>{showText}</Tag>
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
            title: <Text strong style={{ color: "#6c757e" }}>Total Assets</Text>,
            dataIndex: 'totalAssets',
            render: (totalAssets, vo) => {
                return <>
                    {totalAssets}
                </>
            },
            width: 40,
            fixed: 'left',
        },
    ];

    return (<>
        <Title level={3}>NFT Tokens</Title>
        <Card>
            <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
                pagination={pagination}
            />
        </Card>
    </>)
}