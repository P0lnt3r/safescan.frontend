
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps, Badge, Progress, TabsProps, Tabs, Divider, InputRef, Input, Button, Space, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { AddressBalanceRankVO, SuperNodeVO } from '../../services';
import type { ColumnsType } from 'antd/es/table';
import EtherAmount from '../../components/EtherAmount';
import { Link as RouterLink } from 'react-router-dom';
import {
    SearchOutlined
} from '@ant-design/icons';
import { format } from '../../utils/NumberFormat';
import { fetchSuperNodes } from '../../services/node';
import { PresetStatusColorType } from 'antd/es/_util/colors';
import SupernodesRegisters from './SupernodesRegisters';
import Address, { ChecksumAddress } from '../../components/Address';
import SupernodesVoteActions from './SupernodesVoteActions';
import { MatchEnodeIP } from './Utils';
import SuperNodeList from './SuperNodeList';
import SupernodeHistoryChart from './SupernodeHistoryChart';
import SupernodeStatePie from './SupernodeStatePie';

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

    const columns: ColumnsType<SuperNodeVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Rank</Text>,
            dataIndex: 'rank',
            render: (rank) => <>
                {rank}
            </>,
            width: "8%",
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
                const { enode } = supernodeVO;
                return <>
                    <Address address={address} style={{
                        hasLink: true,
                        ellipsis: false
                    }} to={`/node/${address}`} />
                    <br />
                    <Text strong>{MatchEnodeIP(enode)}</Text>
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
        <Title level={3}>Safe4 Network Supernodes</Title>
        <Row>
            <Col span={12}>
                <SupernodeHistoryChart />
            </Col>
            <Col offset={2} span={10}>
                <SupernodeStatePie />
            </Col>
        </Row>
        <Divider style={{ margin: '40px 0px' }} />
        <SuperNodeList />
        <Divider style={{ margin: '20px 0px' }} />
        <Card>
            <Tabs defaultActiveKey="1" items={items} />
        </Card>
    </>)


}