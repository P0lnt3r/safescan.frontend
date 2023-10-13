
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps, Badge, Divider, TabsProps, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO, MasterNodeVO, SuperNodeVO } from '../../services';
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
import { fetchMasterNodes, fetchSuperNodes } from '../../services/node';
import { PresetStatusColorType } from 'antd/es/_util/colors';
import MasternodesRegisters from './MasternodesRegisters';
import { ChecksumAddress } from '../../components/Address';

const { Title, Text, Link, Paragraph } = Typography;


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
            width: 50,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: 'addr',
            render: (address) => {
                let checksumAddress = ChecksumAddress(address)
                return <>
                    <Text>
                        <RouterLink  to={`/node/${checksumAddress}`}>
                            <Link style={{lineHeight:"42px"}}>{checksumAddress}</Link>
                        </RouterLink>
                        <Paragraph style={{
                            display: "inline-block"
                        }} copyable={{ text: checksumAddress }}></Paragraph>
                    </Text>
                </>
            },
            width: 250,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Name</Text>,
            dataIndex: 'description',
            render: (description) => <>
                {description}
            </>,
            width: 150,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>IP</Text>,
            dataIndex: 'ip',
            render: (ip) => <>
                {ip}
            </>,
            width: 40,
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
            width: 40,
        },
    ];


    const items: TabsProps['items'] = [
        {
            key: 'registers',
            label: 'Registers',
            children: <MasternodesRegisters />,
        },
        {
            key: 'stateUpdateEvents',
            label: 'State Update Events',
            children: '[State Update Events:<Table:List>]',
        },
    ];

    return (<>
        <Title level={3}>Safe4 Network Masternodes</Title>
        [Text : What is MasterNode ? || How to create MasterNode...]
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={(txVO) => txVO.id}
            style={{ marginTop: "20px" }}
        />
        <Divider style={{ margin: '20px 0px' }} />
        <Card>
            <Tabs defaultActiveKey="1" items={items} />
        </Card>
    </>)


}