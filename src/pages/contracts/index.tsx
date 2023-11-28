import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps, Badge, Divider, TabsProps, Tabs, Input, Space, Button, InputRef, Tag, TablePaginationConfig } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO, Contract_Compile_VO, MasterNodeVO, SuperNodeVO } from '../../services';
import type { ColumnsType } from 'antd/es/table';
import EtherAmount from '../../components/EtherAmount';
import { Link as RouterLink } from 'react-router-dom';
import {
    ThunderboltOutlined,
    ThunderboltFilled,
    ToolFilled
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

    const RenderCompileVersion = (version: string) => {
        const content = version ? version.substring(
            0, version.indexOf("+")
        ) : "-";
        return content
    }

    const columns: ColumnsType<Contract_Compile_VO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: 'address',
            render: (address, vo) => {
                return <>
                    <Address address={address} propVO={vo.addressPropVO} style={{ forceTag: false, hasLink: true }} />
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
            width: 60,
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
                            <RouterLink to={`/tx/${creatorTransactionHash}`}>
                                {DateFormat(creatorTimestamp * 1000)}
                            </RouterLink>
                        </>
                    }
                </>
            },
            width: 50,
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
                    <Text>{RenderCompileVersion(compileVersion)}</Text>
                </>
            },
            width: 25,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Setting</Text>,
            dataIndex: 'optimizerEnabled',
            render: (_, vo) => {
                const {
                    optimizerEnabled, optimizerRuns, deployedArgsAbiEncode
                } = vo;
                return <>
                    {
                        !optimizerEnabled && !deployedArgsAbiEncode && <>
                            <Text strong>-</Text>
                        </>
                    }
                    {
                        optimizerEnabled && <>
                            <Tooltip title="Optimization Enabled">
                                <Tag style={{
                                    width: "24px", borderRadius: "12px", paddingLeft: "5px"
                                }}>
                                    <ThunderboltFilled style={{ color: "#6f6f6f" }} />
                                </Tag>
                            </Tooltip>
                        </>
                    }
                    {
                        deployedArgsAbiEncode && <>
                            <Tooltip title="Constructor Arguments">
                                <Tag style={{
                                    width: "24px", borderRadius: "12px", paddingLeft: "5px"
                                }}>
                                    <ToolFilled style={{ color: "#6f6f6f" }} />
                                </Tag>
                            </Tooltip>
                        </>
                    }
                </>
            },
            width: 25,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Verified Date</Text>,
            dataIndex: 'verifyTimestamp',
            render: (verifyTimestamp, vo) => {
                return <>
                    <Text>{verifyTimestamp ? DateFormat(verifyTimestamp * 1000) : "-"}</Text>
                </>
            },
            width: 50,
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