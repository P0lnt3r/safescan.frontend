
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps, Badge , Progress } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO, SuperNodeVO } from '../../services';
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
import { fetchSuperNodes } from '../../services/node';
import { PresetStatusColorType } from 'antd/es/_util/colors';

const { Title, Text, Link } = Typography;


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
    async function doFetchSuperNodes() {
        fetchSuperNodes({
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
            width: 30,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Vote Obtained</Text>,
            dataIndex: 'amount',
            render: (amount, superNode) => {
                const { totalAmount , totalNum } = superNode.voteInfo;
                return <>
                    <Text strong>
                        {<EtherAmount raw={totalNum} fix={18} ignoreLabel></EtherAmount>}
                    </Text>
                    <Text type='secondary' style={{fontSize:"12px",float:"right"}}>
                        [{<EtherAmount raw={totalAmount} fix={18}></EtherAmount>}]
                    </Text>
                    <Progress percent={ Number((Number(superNode.voteObtainedRate) * 100).toFixed(2)) } showInfo={true} />
                </>
            },
            width: 120,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: 'addr',
            render: (address) => <>
                <RouterLink to={`/address/${address.toLowerCase()}`}>
                    <Link>{address.toLowerCase()}</Link>
                </RouterLink>
            </>,
            width: 220,
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
            width: 30,
        },
        
        {
            title: <Text strong style={{ color: "#6c757e" }}>Amount</Text>,
            dataIndex: 'amount',
            render: (amount) => <>
                <Text strong>
                    {<EtherAmount raw={amount} fix={18}></EtherAmount>}
                </Text>
            </>,
            width: 150,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>State</Text>,
            dataIndex: 'stateInfo',
            render: (stateInfo) => <>
                {State(stateInfo.state)}
            </>,
            width: 30,
        },
    ];


    return (<>
        <Title level={3}>SuperNodes</Title>
        [Text : What is SuperNode ? || How to create SuperNode...]
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={(txVO) => txVO.id}
            style={{marginTop:"20px"}}
        />
    </>)


}