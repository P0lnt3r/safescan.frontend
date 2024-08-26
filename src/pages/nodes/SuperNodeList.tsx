
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps, Badge, Progress, TabsProps, Tabs, Divider, InputRef, Input, Button, Space, Tag, Alert } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SuperNodeVO } from '../../services';
import type { ColumnsType } from 'antd/es/table';
import EtherAmount from '../../components/EtherAmount';
import { fetchSuperNodes } from '../../services/node';
import Address, { ChecksumAddress } from '../../components/Address';
import { isValidIP, isValidNodeID, MatchEnodeIP, RenderNodeState } from './Utils';
import { ethers } from 'ethers';

const { Title, Text, Link, Paragraph } = Typography;

export default () => {

    const [queryInput, setQueryInput] = useState<string>();
    const [tableData, setTableData] = useState<SuperNodeVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [tableQueryParams, setTableQueryParams] = useState<{
        address?: string,
        name?: string,
        ip?: string,
        id?: number,
        states?: number[]
    }>({});

    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 5,
        showTotal: (total) => <>Total : {total}</>,
    });

    async function doFetchSuperNodes() {
        setLoading(true);
        fetchSuperNodes({
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
            })
            setTableData(data.records);
        })
    }

    const columns: ColumnsType<SuperNodeVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Rank</Text>,
            dataIndex: 'rank',
            render: (rank) => <>{rank}</>,
            width: "8%",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>State</Text>,
            dataIndex: 'state',
            render: (state) => RenderNodeState(state),
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
            width: "10%",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Vote Obtained</Text>,
            dataIndex: 'amount',
            render: (amount, superNode) => {
                const { totalAmount, totalVoteNum, totalVoteAmount } = superNode;
                return <>
                    <Text strong>
                        {<EtherAmount raw={totalVoteNum} fix={2} ignoreLabel></EtherAmount>}
                    </Text>
                    <Text type='secondary' style={{ fontSize: "12px", float: "right" }}>
                        [{<EtherAmount raw={totalVoteAmount} fix={2}></EtherAmount>}]
                    </Text>
                    <Progress style={{ width: "90%" }} percent={Number((Number(superNode.voteObtainedRate) * 100).toFixed(2))} status={"normal"} />
                </>
            },
            width: "18%",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: 'addr',
            render: (address, supernodeVO) => {
                const { id, enode } = supernodeVO;
                return <>
                    <Address address={address} style={{
                        hasLink: true,
                        ellipsis: false
                    }} to={`/node/${address}`} />
                    <Row>
                        <Col span={2}>
                            <Text strong>ID:{id}</Text>
                        </Col>
                        <Col span={16}>
                            <Divider type='vertical' />
                            <Text strong>IP:{MatchEnodeIP(enode)}</Text>
                        </Col>
                    </Row>

                </>
            },
            width: "34%",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Description</Text>,
            dataIndex: 'description',
            render: (description, supernodeVO) => {
                const { name } = supernodeVO;
                return <>
                    <Text strong style={{ width: "250px" }} ellipsis>{name}</Text>
                    <Text type='secondary' style={{ width: "250px" }} ellipsis>{description}</Text>
                </>
            },
            width: "20%",
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
    ];

    const doQuery = useCallback(() => {
        const _tableQueryParams: {
            address : string | undefined,
            id : number  | undefined,
            ip : string  | undefined,
            name : string  | undefined
        } = {
            address : undefined,
            id : undefined,
            ip : undefined,
            name : undefined
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
                _tableQueryParams.name = queryInput;
            }
        }
        setTableQueryParams({ 
            ...tableQueryParams ,
            ..._tableQueryParams 
        });
    }, [queryInput]);

    useEffect(() => {
        pagination.current = 1;
        doFetchSuperNodes();
    }, [tableQueryParams]);

    return (<>
        <Row>
            <Col span={8}>
                <Input.Search size='large' placeholder='ID|Address|Name|IP' onSearch={doQuery} onChange={(event) => {
                    const input = event.target.value;
                    setQueryInput(input);
                }} />
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
                doFetchSuperNodes();
            }}
            style={{ marginTop: "20px" }}
        />
    </>)


}