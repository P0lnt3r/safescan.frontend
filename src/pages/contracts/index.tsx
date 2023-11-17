import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps, Badge, Divider, TabsProps, Tabs, Input, Space, Button, InputRef, Tag, TablePaginationConfig } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO, Contract_Compile_VO, MasterNodeVO, SuperNodeVO } from '../../services';
import type { ColumnsType } from 'antd/es/table';
import EtherAmount from '../../components/EtherAmount';
import { Link as RouterLink } from 'react-router-dom';
import {
    UserOutlined,
    FileTextOutlined,
    SafetyOutlined,
    ApartmentOutlined,
    SearchOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import { format } from '../../utils/NumberFormat';
import { fetchMasterNodes, fetchSuperNodes } from '../../services/node';
import { PresetStatusColorType } from 'antd/es/_util/colors';
import Address, { ChecksumAddress } from '../../components/Address';
import { fetchContracts } from '../../services/contract';
import { DateFormat } from '../../utils/DateUtil';

const { Title, Text, Link, Paragraph } = Typography;

const DEFAULT_PAGESIZE = 20;

export default () => {

    const [tableData, setTableData] = useState<Contract_Compile_VO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<Contract_Compile_VO>();
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        position: ["bottomRight"],
        pageSizeOptions: [],
        responsive: true,
    });

    function paginationOnChange(page: number, pageSize: number) {
        pagination.current = page;
        doFetchContracts();
    }

    function doFetchContracts() {
        setLoading(true);
        fetchContracts({
            current: pagination.current,
            pageSize: pagination.pageSize,
        }).then(data => {
            setLoading(false);
            setTableData(data.records);
            setPagination({
                ...pagination,
                current: data.current,
                total: data.total,
                pageSize: data.pageSize,
                onChange: paginationOnChange
            })
        })

    }

    useEffect(() => {
        doFetchContracts();
    }, []);

    const columns: ColumnsType<Contract_Compile_VO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: 'address',
            render: (address, vo) => {
                return <>
                    <Address address={address} style={{ forceTag: false, hasLink: true }} />
                </>
            },
            width: 60,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Contract Name</Text>,
            dataIndex: 'name',
            render: (name, vo) => {
                return <>
                    <Text strong>{name}</Text>
                </>
            },
            width: 40,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Deployed Date</Text>,
            dataIndex: 'creatorBlockNumber',
            render: (creatorBlockNumber, vo) => {
                const {
                    creatorTransactionHash, creatorTimestamp
                } = vo;
                return <>
                    {
                        creatorBlockNumber == 0 && <>
                            <Text>GENESIS</Text>
                        </>
                    }
                    {
                        creatorBlockNumber != 0 && <>
                            {DateFormat(creatorTimestamp * 1000)}
                        </>
                    }
                </>
            },
            width: 40,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Compiler</Text>,
            dataIndex: 'compileType',
            render: (compileType, vo) => {
                return <>
                    <Text>{compileType ? compileType : "-"}</Text>
                </>
            },
            width: 40,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Version</Text>,
            dataIndex: 'compileVersion',
            render: (compileVersion, vo) => {
                return <>
                    <Text>{compileVersion ? compileVersion : "-"}</Text>
                </>
            },
            width: 40,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Setting</Text>,
            dataIndex: 'optimizerEnabled',
            render: (optimizerEnabled, vo) => {
                return <>
                    <Text strong>{optimizerEnabled}</Text>
                </>
            },
            width: 40,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Verified Date</Text>,
            dataIndex: 'verifyTime',
            render: (verifyTime, vo) => {
                return <>
                    <Text>{verifyTime ? verifyTime : "-"}</Text>
                </>
            },
            width: 40,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>License</Text>,
            dataIndex: 'license',
            render: (license, vo) => {
                return <>
                    <Text>{license}</Text>
                </>
            },
            width: 40,
            fixed: 'left',
        },
    ];

    return <>
        <Title level={3}>Contracts</Title>
        <Divider />
        <Card>
            <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
                pagination={pagination}
            />
        </Card>
    </>

}