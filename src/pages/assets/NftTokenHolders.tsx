import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps , Progress  } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO, NftTokenHoldRankVO } from '../../services';
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
import ERC20TokenAmount from '../../components/ERC20TokenAmount';
import { fetchNftTokenHoldRank } from '../../services/assets';
import Address from '../../components/Address';
const { Title, Text, Link } = Typography;

const DEFAULT_PAGESIZE = 20;

export default ({ token }: { token: string }) => {
    const { t } = useTranslation();
    function paginationOnChange(current: number, pageSize: number) {
        pagination.current = current;
        doFetchNftTokenHoldRank();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    const [tableData, setTableData] = useState<NftTokenHoldRankVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    async function doFetchNftTokenHoldRank() {
        setLoading(true)
        fetchNftTokenHoldRank( token ,  {
            current: pagination.current,
            pageSize: pagination.pageSize,
        }).then(data => {
            setLoading(false);
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
        doFetchNftTokenHoldRank();
    }, []);


    const columns: ColumnsType<NftTokenHoldRankVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Rank</Text>,
            dataIndex: 'rank',
            render: (rank) => <Text strong>{rank}</Text >,
            width: 40,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: 'owner',
            render: (owner , vo) => <>
                <Address address={owner} propVO={vo.ownerPropVO} />
            </>,
            width: 140,
        },
        
        {
            title: <Text strong style={{ color: "#6c757e" }}>Quantity</Text>,
            dataIndex: 'tokenHoldCount',
            render: (tokenHoldCount, vo) => {
                return <>
                    {
                        tokenHoldCount
                    }
                </>
            },
            width: 120,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Percentage</Text>,
            dataIndex: 'percentage',
            render: (percentage) => {
                let _percentage = percentage.substring(0 , percentage.indexOf("%") - 1);
                return <>
                    <Text>{percentage}</Text>
                    <br />
                    <Progress percent={_percentage} showInfo={false} size="small"/>
                </>
            },
            width: 80,
        },
    ];

    return <>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            loading={loading}
            pagination={pagination} rowKey={(txVO) => txVO.owner}
        />
    </>

}