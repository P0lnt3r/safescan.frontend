
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO, ERC721TokenVO, ERC721TransferVO } from '../../services';
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
import { fetchERC721Tokens } from '../../services/assets';
import { fetchERC721Transfers, fetchTransactions } from '../../services/tx';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import ERC20Logo from '../../components/ERC20Logo';

const { Title, Text, Link } = Typography;

export default () => {

    function paginationOnChange(page: number, pageSize: number) {
        pagination.current = page;
        doFetchERC721Transfers();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    async function doFetchERC721Transfers() {
        fetchERC721Transfers({
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
    const [tableData, setTableData] = useState<ERC721TransferVO[]>([]);

    useEffect(() => {
        pagination.current = 1;
        doFetchERC721Transfers();
    }, []);

    const columns: ColumnsType<ERC721TransferVO> = [
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
            title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
            dataIndex: 'to',
            width: 180,
            render: (to) =>
                <Tooltip title={to}>{
                    <RouterLink to={`/address/${to}`}>
                        <Link style={{ width: "80%", marginLeft: "5px" }} ellipsis>{to}</Link>
                    </RouterLink>
                }</Tooltip>
        },
    ];

    return (<>
        <Title level={3}>ERC721 Token Transfers</Title>
        <Card>
            <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
                pagination={pagination}
            />
        </Card>
    </>)
}