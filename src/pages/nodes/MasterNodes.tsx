
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps, Badge, Divider, TabsProps, Tabs, Input, Space, Button, InputRef, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { AddressBalanceRankVO, MasterNodeVO, SuperNodeVO } from '../../services';
import type { ColumnsType } from 'antd/es/table';
import EtherAmount from '../../components/EtherAmount';
import {
    SearchOutlined,
} from '@ant-design/icons';
import { fetchMasterNodes, fetchSuperNodes } from '../../services/node';
import { PresetStatusColorType } from 'antd/es/_util/colors';
import MasternodesRegisters from './MasternodesRegisters';
import Address, { ChecksumAddress } from '../../components/Address';
import { BaseType } from 'antd/lib/typography/Base';
import { RenderNodeState } from './Utils';
import MasternodeList from './MasternodeList';
import MasternodeHistoryChart from './MasternodeHistoryChart';
import MasternodeStatePie from './MasternodeStatePie';

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
    const [tableQueryParams, setTableQueryParams] = useState<{
        address?: string,
        name?: string,
        ip?: string
    }>({});

    async function doFetchMasterNodes() {
        fetchMasterNodes({
            current: pagination.current,
            pageSize: pagination.pageSize,
            ...tableQueryParams
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
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        pagination.current = 1;
        doFetchMasterNodes();
    }, []);

    const columns: ColumnsType<MasterNodeVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>ID</Text>,
            dataIndex: 'id',
            render: (id) => <>
                <Text strong>{id}</Text>
            </>,
            width: "100px"
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>State</Text>,
            dataIndex: 'state',
            render: (state) => RenderNodeState(5),
            width: "100px"
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: 'addr',
            render: (address, masternodeVO) => {
                return <>
                    <Address address={address} style={{
                        hasLink: true,
                        ellipsis: false
                    }} to={`/node/${address}`} />
                </>
            },
            width: "200px"
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>IP</Text>,
            dataIndex: 'enode',
            render: (enode) => {
                const regex = /(?<=@)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?=:)/;
                const match = enode.match(regex);
                let ip = '';
                if (match) {
                    ip = match[0];
                    console.log("Matched IP:", ip);
                }
                return <>
                    <Text strong ellipsis>{ip}</Text>
                </>
            },
            width: "100px"
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Description</Text>,
            dataIndex: 'description',
            render: (description) => <>
                <Text title={description} type='secondary' style={{ width: "300px" }} ellipsis>{description}</Text>
            </>,
            width: "300px"
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Amount</Text>,
            dataIndex: 'totalAmount',
            render: (totalAmount) => <>
                <Text strong>
                    {<EtherAmount raw={totalAmount} fix={18}></EtherAmount>}
                </Text>
            </>,
            width: "150px"
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

    const closePropSearch = (prop?: string) => {
        if (prop == "address") {
            tableQueryParams.address = undefined;
        }
        if (prop == "ip") {
            tableQueryParams.ip = undefined;
        }
        if (prop == "name") {
            tableQueryParams.name = undefined;
        }
        pagination.current = 1;
        doFetchMasterNodes();
    }

    return (<>
        <Title level={3}>Safe4 Network Masternodes</Title>
        <Row>
            <Col span={12}>
                <MasternodeHistoryChart />
            </Col>
            <Col offset={2} span={10}>
                <MasternodeStatePie />
            </Col>
        </Row>
        <Divider style={{ margin: '20px 0px' }} />

        <Title level={4}>Masternode List</Title>
        <MasternodeList />
        <Divider style={{ margin: '20px 0px' }} />

        <Title level={4}>Masternode Actions</Title>
        <Card>
            <Tabs defaultActiveKey="1" items={items} />
        </Card>

    </>)


}