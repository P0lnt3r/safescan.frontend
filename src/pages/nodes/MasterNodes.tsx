
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps, Badge } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO, MasterNodeVO, SuperMasterNodeVO } from '../../services';
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
import { fetchMasterNodes, fetchSuperMasterNodes } from '../../services/node';
import { PresetStatusColorType } from 'antd/es/_util/colors';

const { Title, Text, Link } = Typography;


export default () => {

    function paginationOnChange(page: number, pageSize: number) {
        pagination.current = page;
        doFetchMasterNodes();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    async function doFetchMasterNodes() {
        fetchMasterNodes({
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
    const [tableData, setTableData] = useState<MasterNodeVO[]>([]);

    useEffect(() => {
        pagination.current = 1;
        doFetchMasterNodes();
    }, []);

    function State(state: number) {
        let _state: {
            status: PresetStatusColorType,
            text: string
        } = {
            status: "default",
            text: "default"
        }
        if (state == 1) {
            _state.status = "processing";
            _state.text = "ENABLED";
        }
        return (<>
            <Badge {..._state} />
        </>)

    }

    const columns: ColumnsType<MasterNodeVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>ID</Text>,
            dataIndex: 'id',
            render: (id) => <>
                {id}
            </>,
            width: 40,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: 'addr',
            render: (address) => <>
                <RouterLink to={`/address/${address.toLowerCase()}`}>
                    <Link>{address.toLowerCase()}</Link>
                </RouterLink>
            </>,
            width: 180,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Name</Text>,
            dataIndex: 'description',
            render: (description) => <>
                {description}
            </>,
            width: 140,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>IP</Text>,
            dataIndex: 'ip',
            render: (ip) => <>
                {ip}
            </>,
            width: 140,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Amount</Text>,
            dataIndex: 'amount',
            render: (amount) => <>
                <Text strong>
                    {<EtherAmount raw={amount} fix={18}></EtherAmount>}
                </Text>
            </>,
            width: 140,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>State</Text>,
            dataIndex: 'stateInfo',
            render: (stateInfo) => <>
                {State(stateInfo.state)}
            </>,
            width: 140,
        },
    ];


    return (<>
        <Title level={3}>MasterNodes</Title>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={(txVO) => txVO.id}
        />
    </>)


}