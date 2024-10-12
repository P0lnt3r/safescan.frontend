
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO } from '../../services';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import EtherAmount from '../../components/EtherAmount';
import { useTranslation } from 'react-i18next';
import { SorterResult } from 'antd/es/table/interface';
import Address, { ChecksumAddress } from '../../components/Address';
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
        let _sorter = sorter as SorterResult<AddressBalanceRankVO>;
        const { field, order } = _sorter;
        const _orderField = tableQueryParams.orderProp;
        tableQueryParams.orderMode = order?.toString();
        tableQueryParams.orderProp = field?.toString();
        if (!order) {
            tableQueryParams.orderMode = undefined;
            tableQueryParams.orderProp = undefined;
        }
        pagination.current = field != _orderField ? 1 : page.current;
        pagination.pageSize = page.pageSize;
        doFetchAddressBalanceRank();
    }

    const columns: ColumnsType<AddressBalanceRankVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Rank</Text>,
            dataIndex: 'rank',
            render: (rank) => <Text strong>{rank}</Text >,
            width: 50,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: 'address',
            render: (address, addressBalanceRankVO: AddressBalanceRankVO) => <>
                <Address address={address} style={{
                    hasLink: true,
                    ellipsis: false,
                    noTip: true,
                    forceTag : false,
                }} to={`/address/${address}`} />
            </>,
            width: 150,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Name Tag</Text>,
            dataIndex: 'tag',
            render: (tag, vo) => <>
                {
                    vo.addressPropVO && <Address address={vo.address} propVO={vo.addressPropVO} style={{ hasLink: false , forceTag:true }}></Address>
                }
            </>,
            width: 100,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Total Balance</Text>,
            dataIndex: 'totalBalance',
            sorter: true,
            defaultSortOrder: "descend",
            sortDirections: ['descend'],
            render: (totalBalance) => {
                return <>
                    <Text strong><EtherAmount raw={totalBalance} fix={4} /></Text>
                </>
            },
            width: 100,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Locked Amount</Text>,
            dataIndex: 'lockAmount',
            sorter: true,
            sortDirections: ['descend'],
            render: (lockAmount) => {
                return <>
                    <Text strong type="secondary">
                        <EtherAmount raw={lockAmount} fix={4} />
                    </Text>
                </>
            },
            width: 100,
        }
    ];

    return (<>

        <Title level={3}>Top Accounts by SAFE Balance </Title>

        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            loading={loading}
            pagination={pagination} rowKey={(txVO) => txVO.address}
            onChange={handleTableOnChange}
        />

    </>)

}