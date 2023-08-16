import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO } from '../../services';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import EtherAmount from '../../components/EtherAmount';
import { Link as RouterLink } from 'react-router-dom';
import {
    UserOutlined,
    FileTextOutlined,
    SafetyOutlined,
    ApartmentOutlined
} from '@ant-design/icons';
import { format } from '../../utils/NumberFormat';
import { JSBI } from '@uniswap/sdk';
import { useTranslation } from 'react-i18next';
import { SorterResult } from 'antd/es/table/interface';
import ERC20TokenAmount from '../../components/ERC20TokenAmount';
const { Title, Text, Link } = Typography;

const DEFAULT_PAGESIZE = 20;

export default ({ token }: { token: string }) => {
    const { t } = useTranslation();
    function paginationOnChange(current: number, pageSize: number) {
        pagination.current = current;
        doFetchTokenAddressBalanceRank();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    const [tableData, setTableData] = useState<AddressBalanceRankVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    async function doFetchTokenAddressBalanceRank() {
        fetchAddressBalanceRank({
            current: pagination.current,
            pageSize: pagination.pageSize,
            token: token
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
    useEffect(() => {
        pagination.current = 1;
        doFetchTokenAddressBalanceRank();
    }, []);


    const columns: ColumnsType<AddressBalanceRankVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Rank</Text>,
            dataIndex: 'rank',
            render: (rank) => <Text strong>{rank}</Text >,
            width: 40,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: 'address',
            render: (address, addressBalanceRankVO: AddressBalanceRankVO) => <>
                {
                    addressBalanceRankVO.addressPropVO?.type == 'contract' &&
                    <>
                        <Tooltip title="Contract"><FileTextOutlined style={{ marginRight: "5px" }} /></Tooltip>
                    </>
                }
                <RouterLink to={`/address/${address}`}>
                    <Link>{address}</Link>
                </RouterLink>
            </>,
            width: 140,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Percentage</Text>,
            dataIndex: 'percentage',
            render: (percentage, addressBalanceRankVO: AddressBalanceRankVO) => <>
                {
                    percentage
                }
            </>,
            width: 140,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Balance</Text>,
            dataIndex: 'balance',
            render: (balance, vo) => {
                const { tokenPropVO } = vo;
                const erc20Prop = tokenPropVO && tokenPropVO.subType === "erc20" ? tokenPropVO?.prop : undefined;
                const erc20 = erc20Prop ? JSON.parse(erc20Prop) : undefined;
                return <>
                    {
                        vo.token && <>
                            <Text strong>
                                <ERC20TokenAmount address={vo.token} name={erc20.name} symbol={erc20.symbol}
                                    decimals={erc20.decimals} raw={balance} fixed={erc20.decimals} />
                                <span style={{ marginLeft: "5px" }}>{erc20.symbol}</span>
                            </Text>
                        </>
                    }
                </>
            },
            width: 120,
        },
        {

            title: <Text strong style={{ color: "#6c757e" }}>Before 24H</Text>,
            dataIndex: 'changeBefore30D',
            render: (changeBefore30D, vo) => {
                if ( !changeBefore30D ){
                    changeBefore30D = vo.balance;
                }
                let changeDown = false;
                if (changeBefore30D.indexOf("-") >= 0) {
                    changeBefore30D = changeBefore30D.substring(changeBefore30D.indexOf("-") + 1);
                    changeDown = true;
                }
                const changeAmount = JSBI.BigInt(changeBefore30D);
                const hasChange = !JSBI.EQ(changeAmount, 0);
                const changeUp = hasChange && !changeDown;
                const { tokenPropVO } = vo;
                const erc20Prop = tokenPropVO && tokenPropVO.subType === "erc20" ? tokenPropVO?.prop : undefined;
                const erc20 = erc20Prop ? JSON.parse(erc20Prop) : undefined;
                return <>
                    <Row>
                        {
                            hasChange && <>
                                <Col span={24}>
                                    <Text strong style={{ color: changeUp ? "green" : "red" }}>
                                        {changeUp   && "+"}
                                        {changeDown && "-"}
                                        <ERC20TokenAmount address={vo.address} name={erc20.name} symbol={erc20.symbol}
                                            decimals={erc20.decimals} raw={changeBefore30D} fixed={erc20.decimals} />
                                        <span style={{ marginLeft: "5px" }}>{erc20.symbol}</span>
                                    </Text>
                                </Col>
                                <Col span={24}>
                                    <Text strong style={{ fontSize: "12px", color: changeUp ? "green" : "red" }}>
                                        { vo.changeBefore30DPercent && changeUp && "+"}
                                        <span>{vo.changeBefore30DPercent}</span>
                                    </Text>
                                </Col>
                            </>
                        }
                        {
                            !hasChange && <>
                                <Col span={24}>
                                    <Text strong type='secondary'>
                                        <ERC20TokenAmount address={vo.address} name={erc20.name} symbol={erc20.symbol}
                                            decimals={erc20.decimals} raw={changeBefore30D} fixed={erc20.decimals} />
                                        <span style={{ marginLeft: "5px" }}>{erc20.symbol}</span>
                                    </Text>
                                </Col>
                            </>
                        }
                    </Row>

                </>
            },
            width: 120,
        },
    ];

    return <>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            loading={loading}
            pagination={pagination} rowKey={(txVO) => txVO.address}
        />
    </>

}