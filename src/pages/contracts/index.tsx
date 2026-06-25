import { Card, Table, Typography, Tooltip, Divider, Tag, TablePaginationConfig } from 'antd';
import { useEffect, useState } from 'react';
import { Contract_Compile_VO } from '../../services';
import type { ColumnsType } from 'antd/es/table';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
    ThunderboltFilled,
    ToolFilled
} from '@ant-design/icons';
import { fetchContracts } from '../../services/contract';
import { DateFormat } from '../../utils/DateUtil';
import Address from '../../components/Address';

const { Title, Text } = Typography;

const DEFAULT_PAGESIZE = 20;

export default function ContractsPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const current = Number(searchParams.get('page') || 1);
    const pageSize = Number(searchParams.get('pageSize') || DEFAULT_PAGESIZE);

    const [tableData, setTableData] = useState<Contract_Compile_VO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState(0);

    const pagination: TablePaginationConfig = {
        current,
        pageSize,
        total,
        position: ["topRight", "bottomRight"],
        showSizeChanger: true,
    };

    useEffect(() => {
        setLoading(true);
        fetchContracts({ current, pageSize }).then((data) => {
            setLoading(false);
            setTableData(data.records);
            setTotal(data.total);
        });
    }, [current, pageSize]);

    const handlePageChange = (page: number, size?: number) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('page', String(page));
            if (size) next.set('pageSize', String(size));
            return next;
        });
    };

    const RenderCompileVersion = (version: string) => {
        const content = version ? version.substring(
            0, version.indexOf("+")
        ) : "-";
        return content
    }

    const RenderCompileType = ( compile : string ) => {
        if ( compile ){
            if ( "standardInputJson" == compile ){
                return "Solidity(Json)";
            }
            return "Solidity";
        }
        return "-";
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
                    <Text>{RenderCompileType(compileType)}</Text>
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
        // {
        //     title: <Text strong style={{ color: "#6c757e" }}>Verified Date</Text>,
        //     dataIndex: 'verifyTimestamp',
        //     render: (verifyTimestamp, vo) => {
        //         return <>
        //             <Text>{verifyTimestamp ? DateFormat(verifyTimestamp * 1000) : "-"}</Text>
        //         </>
        //     },
        //     width: 50,
        //     fixed: 'left',
        // },
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
            <Table
                columns={columns}
                dataSource={tableData}
                rowKey={(vo) => vo.address}
                scroll={{ x: 800 }}
                loading={loading}
                pagination={{
                    ...pagination,
                    onChange: handlePageChange,
                }}
            />
        </Card>
    </>

}