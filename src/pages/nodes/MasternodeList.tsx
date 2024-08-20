
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps, Badge, Divider, TabsProps, Tabs, Input, Space, Button, InputRef, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { MasterNodeVO } from '../../services';
import type { ColumnsType } from 'antd/es/table';
import EtherAmount from '../../components/EtherAmount';
import { fetchMasterNodes, fetchSuperNodes } from '../../services/node';
import Address from '../../components/Address';
import { RenderNodeState } from './Utils';

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
            render: (state) => RenderNodeState(1),
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

    return <>
        <Table loading={loading} columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            pagination={pagination} rowKey={(txVO) => txVO.id}
            style={{ marginTop: "20px" }}
        />
    </>
}