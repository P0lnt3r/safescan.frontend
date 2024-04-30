
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps, Badge, Divider, TabsProps, Tabs, Input, Space, Button, InputRef, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { AddressBalanceRankVO, MasterNodeVO, SuperNodeVO } from '../../services';
import type { ColumnsType } from 'antd/es/table';
import EtherAmount from '../../components/EtherAmount';
import { Link as RouterLink } from 'react-router-dom';
import {
    SearchOutlined,
} from '@ant-design/icons';
import { fetchMasterNodes, fetchSuperNodes } from '../../services/node';
import { PresetStatusColorType } from 'antd/es/_util/colors';
import MasternodesRegisters from './MasternodesRegisters';
import Address, { ChecksumAddress } from '../../components/Address';

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
    const [loading ,setLoading] = useState<boolean>(false);

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
            text: "UNKNOWN"
        }
        if (state == 0) {
            _state.status = "success";
            _state.text = "INITIALIZE";
        }
        if (state == 1) {
            _state.status = "processing";
            _state.text = "ENABLED";
        }
        if (state == 2) {
            _state.status = "error";
            _state.text = "ERROR";
        }
        return (<>
            <Badge {..._state} />
        </>)
    }

    const columns: ColumnsType<MasterNodeVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Masternode ID</Text>,
            dataIndex: 'id',
            render: (id) => <>
                <Text strong>{id}</Text>
            </>,
            width: "10%",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: 'addr',
            render: (address) => {
                return <>
                    <Address address={address} style={{
                        hasLink:true,
                        ellipsis:false
                    }} to={`/node/${address}`} />
                </>
            },
            width: "30%",
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
            title: <Text strong style={{ color: "#6c757e" }}>Description</Text>,
            dataIndex: 'description',
            render: (description) => <>
                <Text title={description} type='secondary' style={{width:"400px"}} ellipsis>{description}</Text>
            </>,
            width: "40%",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Amount</Text>,
            dataIndex: 'totalAmount',
            render: (totalAmount) => <>
                <Text strong>
                    {<EtherAmount raw={totalAmount} fix={18}></EtherAmount>}
                </Text>
            </>,
            width: "10%",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>State</Text>,
            dataIndex: 'state',
            render: (state) => <>
                {State(state)}
            </>,
            width: "10%",
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

    const closePropSearch = ( prop ?: string ) => {
        if ( prop == "address" ){
            tableQueryParams.address = undefined;
        }
        if ( prop == "ip" ){
            tableQueryParams.ip = undefined;
        }
        if ( prop == "name" ){
            tableQueryParams.name = undefined;
        }
        pagination.current = 1;
        doFetchMasterNodes();
    }

    return (<>
        <Title level={3}>Safe4 Network Masternodes</Title>
        <br />
        [Text : What is Masternode ? || How to create MasterNode...]
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

        <Table loading={loading} columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={(txVO) => txVO.id}
            style={{ marginTop: "20px" }}
        />
        <Divider style={{ margin: '20px 0px' }} />
        <Card>
            <Tabs defaultActiveKey="1" items={items} />
        </Card>
    </>)


}