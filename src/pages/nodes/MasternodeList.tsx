
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps, Badge, Divider, TabsProps, Tabs, Input, Space, Button, InputRef, Tag, Alert } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { MasterNodeVO } from '../../services';
import type { ColumnsType } from 'antd/es/table';
import EtherAmount from '../../components/EtherAmount';
import { fetchMasterNodes, fetchSuperNodes } from '../../services/node';
import Address from '../../components/Address';
import { isValidIP, isValidNodeID, MatchEnodeIP, RenderNodeState } from './Utils';
import { ethers } from 'ethers';

const { Text } = Typography;

export default () => {

    const [queryInput, setQueryInput] = useState<string>();
    const [queryInputError, setQueryInputError] = useState<string>();
    const [tableData, setTableData] = useState<MasterNodeVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [tableQueryParams, setTableQueryParams] = useState<{
        address?: string,
        id?: number,
        ip?: string,
        states?: number[]
    }>({});
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 10,
        showTotal: (total) => <Text strong>Total: {total}</Text>,
    });

    async function doFetchMasterNodes() {
        setLoading(true);
        console.log("tableQueryParams:", tableQueryParams)
        fetchMasterNodes({
            current: pagination.current,
            pageSize: pagination.pageSize,
            ...tableQueryParams
        }).then(data => {
            setLoading(false);
            setPagination({
                ...pagination,
                current: data.current,
                pageSize: data.pageSize,
                total: data.total,
            });
            setTableData(data.records);
        })
    }

    useEffect(() => {
        pagination.current = 1;
        doFetchMasterNodes();
    }, [tableQueryParams]);

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
            render: (state) => RenderNodeState(state),
            width: "100px",
            filters: [
                {
                    text: 'INITIALIZE',
                    value: '0',
                },
                {
                    text: 'ENABLED',
                    value: '1',
                },
                {
                    text: 'ERROR',
                    value: '2',
                },
            ],
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
            render: (enode) => <Text strong ellipsis>{MatchEnodeIP(enode)}</Text>,
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

    const doQuery = useCallback(() => {
        const _tableQueryParams: {
            address : string | undefined,
            id : number  | undefined,
            ip : string  | undefined
        } = {
            address : undefined,
            id : undefined,
            ip : undefined
        };
        if (queryInput) {
            const isAddress = ethers.utils.isAddress(queryInput);
            const isIdNumber = isValidNodeID(queryInput);
            const isIp = isValidIP(queryInput);
            if (isAddress) {
                _tableQueryParams.address = queryInput;
            }
            if (isIdNumber) {
                _tableQueryParams.id = Number.parseInt(queryInput);
            }
            if (isIp) {
                _tableQueryParams.ip = queryInput;
            }
            if (!isAddress && !isIdNumber && !isIp) {
                setQueryInputError("Please enter a valid ID, IP or address")
                return;
            }
        }
        setTableQueryParams({
            ...tableQueryParams,
            ..._tableQueryParams
        });
    }, [queryInput]);

    return <>
        <Row>
            <Col span={8}>
                <Input.Search size='large' placeholder='ID|Address|IP' onSearch={doQuery} onChange={(event) => {
                    const input = event.target.value;
                    setQueryInputError(undefined);
                    setQueryInput(input);
                }} />
                {
                    queryInputError && <Alert style={{ marginTop: "5px" }} showIcon type='error' message={queryInputError}></Alert>
                }
            </Col>
        </Row>
        <Table loading={loading} columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={(txVO) => txVO.id}
            onChange={({ current }, filters, sorter, extra) => {
                tableQueryParams.states = undefined;
                if (filters.state) {
                    tableQueryParams.states = filters.state as number[];
                }
                pagination.current = current;
                doFetchMasterNodes();
            }}
            style={{ marginTop: "20px" }}
        />
    </>
}