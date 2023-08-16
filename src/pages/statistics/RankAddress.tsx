
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO } from '../../services';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
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
import { useTranslation } from 'react-i18next';
import { SorterResult } from 'antd/es/table/interface';
const { Title, Text, Link } = Typography;
const DEFAULT_PAGESIZE = 20;

export default () => {

    const { t } = useTranslation();
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        position: ["topRight", "bottomRight"],
        pageSizeOptions: [],
        responsive: true,
    });
    const [tableData, setTableData] = useState<AddressBalanceRankVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [tableQueryParams, setTableQueryParams] = useState<{
        orderProp?: string | undefined,
        orderMode?: string | undefined
    }>({});

    async function doFetchAddressBalanceRank() {
        setLoading(true);
        fetchAddressBalanceRank({
            current: pagination.current,
            pageSize: pagination.pageSize,
            orderProp: tableQueryParams.orderProp,
            orderMode: tableQueryParams.orderMode,
        }).then(data => {
            setLoading(false);
            setPagination({
                ...pagination,
                current: data.current,
                pageSize: data.pageSize,
                total: data.total,
            })
            setTableData(data.records);
        })
    }

    useEffect(() => {
        pagination.current = 1;
        doFetchAddressBalanceRank();
    }, []);

    const handleTableOnChange = (page: TablePaginationConfig, filter: any, sorter: any) => {
        let _sorter = sorter as SorterResult<AddressBalanceRankVO>
        const { field, order } = _sorter;
        tableQueryParams.orderMode = order?.toString();
        tableQueryParams.orderProp = field?.toString();
        if (!order) {
            tableQueryParams.orderMode = undefined;
            tableQueryParams.orderProp = undefined;
        }
        pagination.current = page.current;
        pagination.pageSize = page.pageSize
        doFetchAddressBalanceRank();
    }

    const columns: ColumnsType<AddressBalanceRankVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Rank</Text>,
            dataIndex: 'rank',
            render: (rank) => <Text strong>{rank}</Text >,
            width: 30,
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
            width: 70,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Total Balance</Text>,
            dataIndex: 'totalBalance',
            sorter: true,
            defaultSortOrder: "descend",
            render: (totalBalance) => {
                return <>
                    <Text strong><EtherAmount raw={totalBalance} fix={4} /></Text>
                </>
            },
            width: 80,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Lock Amount</Text>,
            dataIndex: 'lockAmount',
            sorter: true,
            render: (lockAmount) => {
                return <>
                    <Text strong type="secondary">
                        <EtherAmount raw={lockAmount} fix={4} />
                    </Text>
                </>
            },
            width: 80,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Before 24H</Text>,
            dataIndex: 'changeBefore30D',
            render: (changeBefore30D, vo) => {

                if ( !changeBefore30D ){
                    changeBefore30D = vo.balance;
                }
                let changeDown = false;
                if (changeBefore30D.indexOf("-") >= 0) {
                    changeBefore30D = changeBefore30D.substring(changeBefore30D.indexOf("-") + 1);
                    changeDown = true;
                }
                const changeAmount = JSBI.BigInt(changeBefore30D);
                const hasChange = !JSBI.EQ(changeAmount, 0);
                const changeUp = hasChange && !changeDown;

                return <>  

                    <Row>
                        {
                            hasChange && <>
                                <Col span={24}>
                                    <Text strong style={{ color: changeUp ? "green" : "red" }}>
                                        {changeUp   && "+"}
                                        {changeDown && "-"}
                                        <EtherAmount raw={changeAmount.toString()} fix={6} />
                                    </Text>
                                </Col>
                                <Col span={24}>
                                    <Text strong style={{ fontSize: "12px", color: changeUp ? "green" : "red" }}>
                                        {vo.changeBefore30DPercent && changeUp && "+"}
                                        <span>{vo.changeBefore30DPercent}</span>
                                    </Text>
                                </Col>
                            </>
                        }
                        {
                            !hasChange && <>
                                <Col span={24}>
                                    <Text strong type='secondary'>
                                        <EtherAmount raw={changeAmount.toString()} fix={4} />
                                    </Text>
                                </Col>
                            </>
                        }
                    </Row>

                </>
            },
            width: 80,
        },
    ];

    return (<>
        <Title level={3}>Top Accounts by SAFE Balance </Title>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            loading={loading}
            onChange={handleTableOnChange}
            pagination={pagination} rowKey={(txVO) => txVO.address}
        />
    </>)

}