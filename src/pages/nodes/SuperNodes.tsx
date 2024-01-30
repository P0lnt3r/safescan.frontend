
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps, Badge, Progress, TabsProps, Tabs, Divider, InputRef, Input, Button, Space, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO, SuperNodeVO } from '../../services';
import type { ColumnsType } from 'antd/es/table';
import EtherAmount from '../../components/EtherAmount';
import { Link as RouterLink } from 'react-router-dom';
import {
    UserOutlined,
    FileTextOutlined,
    SafetyOutlined,
    ApartmentOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { format } from '../../utils/NumberFormat';
import { fetchSuperNodes } from '../../services/node';
import { PresetStatusColorType } from 'antd/es/_util/colors';
import SupernodesRegisters from './SupernodesRegisters';
import { ChecksumAddress } from '../../components/Address';
import SupernodesVoteActions from './SupernodesVoteActions';

const { Title, Text, Link, Paragraph } = Typography;


export default () => {

    function paginationOnChange(page: number, pageSize: number) {
        pagination.current = page;
        doFetchSuperNodes();
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
    async function doFetchSuperNodes() {
        fetchSuperNodes({
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
    const [tableData, setTableData] = useState<SuperNodeVO[]>([]);

    useEffect(() => {
        pagination.current = 1;
        doFetchSuperNodes();
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

    const columns: ColumnsType<SuperNodeVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Rank</Text>,
            dataIndex: 'rank',
            render: (rank) => <>
                {rank}
            </>,
            width: 50,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Vote Obtained</Text>,
            dataIndex: 'amount',
            render: (amount, superNode) => {
                const { totalAmount, totalVoteNum , totalVoterAmount } = superNode;
                return <>
                    <Text strong>
                        {<EtherAmount raw={totalVoteNum} fix={18} ignoreLabel></EtherAmount>}
                    </Text>
                    <Text type='secondary' style={{ fontSize: "12px", float: "right" }}>
                        [{<EtherAmount raw={totalVoterAmount} fix={18}></EtherAmount>}]
                    </Text>
                    <Progress style={{ width: "90%" }} percent={Number((Number(superNode.voteObtainedRate) * 100).toFixed(2))} status={"normal"} />
                </>
            },
            width: 150,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: 'addr',
            render: (address) => {
                let checksumAddress = ChecksumAddress(address)
                return <>
                    <RouterLink to={`/node/${checksumAddress}`}>
                        <Link style={{ lineHeight: "42px" }}>{checksumAddress}</Link>
                    </RouterLink>
                    <Paragraph style={{
                        display: "inline-block"
                    }} copyable={{ text: checksumAddress }}></Paragraph>
                </>
            },
            width: 300,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => <>
                <div style={{ padding: 8, width: "400px", height: "100px" }} onKeyDown={(e) => e.stopPropagation()}>
                    <Text strong>Address</Text>
                    <Input
                        value={tableQueryParams.address}
                        onChange={(e) => {
                            setTableQueryParams({
                                ...tableQueryParams,
                                address: e.target.value
                            })
                        }}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, float: "left" }}
                        onClick={() => {
                            closePropSearch();
                            close();
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        size="small"
                        style={{ width: 90, float: "right" }}
                        onClick={() => {
                            closePropSearch("address")
                            close();
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Name</Text>,
            dataIndex: 'description',
            render: (description) => <>
                {description}
            </>,
            width: 130,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => <>
                <div style={{ padding: 8, width: "400px", height: "100px" }} onKeyDown={(e) => e.stopPropagation()}>
                    <Text strong>Name</Text>
                    <Input
                        value={tableQueryParams.name}
                        onChange={(e) => {
                            setTableQueryParams({
                                ...tableQueryParams,
                                name: e.target.value
                            })
                        }}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, float: "left" }}
                        onClick={() => {
                            closePropSearch();
                            close();
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        size="small"
                        style={{ width: 90, float: "right" }}
                        onClick={() => {
                            closePropSearch("name")
                            close();
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Amount</Text>,
            dataIndex: 'totalAmount',
            render: (totalAmount) => <>
                <Text strong>
                    {<EtherAmount raw={totalAmount} fix={18}></EtherAmount>}
                </Text>
            </>,
            width: 150,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>State</Text>,
            dataIndex: 'state',
            render: (state) => <>
                {State(state)}
            </>,
            width: 10,
        },
    ];

    const items: TabsProps['items'] = [
        {
            key: 'registers',
            label: 'Registers',
            children: <SupernodesRegisters />,
        },
        {
            key: 'votes',
            label: 'Votes',
            children: <SupernodesVoteActions></SupernodesVoteActions>,
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
        doFetchSuperNodes();
    }

    return (<>
        <Title level={3}>SuperNodes</Title>
        [Text : What is SuperNode ? || How to create SuperNode...]
        <Divider />
        {
            (tableQueryParams.address || tableQueryParams.ip || tableQueryParams.name) &&
            <Row style={{
                background: "white"
            }}>
                <div style={{
                    width: "100%",
                }}>
                    <Divider dashed />
                    <Text style={{ marginLeft: "5px", marginRight: "5px" }}>Filters:</Text>
                    <Space size={[0, 8]} wrap>
                        {
                            tableQueryParams.address &&
                            <Tag closable={true} onClose={() => closePropSearch("address")}>
                                Address:{tableQueryParams.address}
                            </Tag>
                        }
                    </Space>
                    <Space size={[0, 8]} wrap>
                        {
                            tableQueryParams.ip &&
                            <Tag closable={true} onClose={() => closePropSearch("ip")}>
                                Ip:{tableQueryParams.ip}
                            </Tag>
                        }
                    </Space>
                    <Space size={[0, 8]} wrap>
                        {
                            tableQueryParams.name &&
                            <Tag closable={true} onClose={() => closePropSearch("name")}>
                                Name:{tableQueryParams.name}
                            </Tag>
                        }
                    </Space>
                    <Divider dashed />
                </div>
            </Row>
        }
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