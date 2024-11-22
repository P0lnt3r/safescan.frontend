import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps, Progress } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressBalanceRank, fetchAddressERC20Balance } from '../../services/address';
import { AddressBalanceRankVO, ERC20AddressBalanceVO } from '../../services';
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
import ERC20Logo from '../../components/ERC20Logo';
import { ChecksumAddress } from '../../components/Address';

const { Title, Text, Link } = Typography;
const DEFAULT_PAGESIZE = 10;

export default ({ address }: { address: string }) => {

    const { t } = useTranslation();

    function paginationOnChange(current: number, pageSize: number) {
        pagination.current = current;
        doFetchAddressERC20Balance();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });
    const [tableData, setTableData] = useState<ERC20AddressBalanceVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    async function doFetchAddressERC20Balance() {
        fetchAddressERC20Balance({
            current: pagination.current,
            pageSize: pagination.pageSize,
            address: address
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
        doFetchAddressERC20Balance();
    }, []);


    const columns: ColumnsType<ERC20AddressBalanceVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Token</Text>,
            dataIndex: 'token',
            render: (token, vo) => {
                const { tokenPropVO } = vo;
                const erc20Prop = tokenPropVO && tokenPropVO.subType === "erc20" ? tokenPropVO?.prop : undefined;
                const erc20 = erc20Prop ? JSON.parse(erc20Prop) : undefined;
                return <RouterLink to={`/token/${token}`}>
                    <ERC20Logo address={address} />
                    <Link ellipsis style={{ width: '80%', marginLeft: "5px" }}>
                        {erc20.name}({erc20.symbol})
                    </Link>
                </RouterLink>
            },
            width: 120,
            fixed: true
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Symbol</Text>,
            dataIndex: 'token',
            render: (symbol, vo) => {
                const { tokenPropVO } = vo;
                const erc20Prop = tokenPropVO && tokenPropVO.subType === "erc20" ? tokenPropVO?.prop : undefined;
                const erc20 = erc20Prop ? JSON.parse(erc20Prop) : undefined;
                return <>
                    <Text strong>{erc20.symbol}</Text>
                </>
            },
            width: 60
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Contract Address</Text>,
            dataIndex: 'token',
            render: (token, vo) => {
                const checksumAddress = ChecksumAddress(token);
                const ellipsisAddress = checksumAddress.substring(0, 8) + "..." + checksumAddress.substring(checksumAddress.length - 8);
                return <RouterLink to={`/token/${token}`}>
                    <Link ellipsis style={{ marginLeft: "5px" }}>
                        {ellipsisAddress}
                    </Link>
                </RouterLink>
            },
            width: 100
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
            width: 140,
        },
        // {
        //     title: <Text strong style={{ color: "#6c757e" }}>Before 24H</Text>,
        //     dataIndex: 'changeBefore30D',
        //     render: (changeBefore30D, vo) => {
        //         if (!changeBefore30D) {
        //             changeBefore30D = vo.balance;
        //         }
        //         let changeDown = false;
        //         if (changeBefore30D.indexOf("-") >= 0) {
        //             changeBefore30D = changeBefore30D.substring(changeBefore30D.indexOf("-") + 1);
        //             changeDown = true;
        //         }
        //         const changeAmount = JSBI.BigInt(changeBefore30D);
        //         const hasChange = !JSBI.EQ(changeAmount, 0);
        //         const changeUp = hasChange && !changeDown;
        //         const { tokenPropVO } = vo;
        //         const erc20Prop = tokenPropVO && tokenPropVO.subType === "erc20" ? tokenPropVO?.prop : undefined;
        //         const erc20 = erc20Prop ? JSON.parse(erc20Prop) : undefined;
        //         return <>
        //             <Row>
        //                 {
        //                     hasChange && <>
        //                         <Col span={24}>
        //                             <Text strong style={{ color: changeUp ? "green" : "red" }}>
        //                                 {changeUp && "+"}
        //                                 {changeDown && "-"}
        //                                 <ERC20TokenAmount address={vo.token} name={erc20.name} symbol={erc20.symbol}
        //                                     decimals={erc20.decimals} raw={changeBefore30D} fixed={erc20.decimals} />
        //                                 <span style={{ marginLeft: "5px" }}>{erc20.symbol}</span>
        //                             </Text>
        //                         </Col>
        //                         <Col span={24}>
        //                             <Text strong style={{ fontSize: "12px", color: changeUp ? "green" : "red" }}>
        //                                 {vo.changeBefore30DPercent && changeUp && "+"}
        //                                 <span>{vo.changeBefore30DPercent}</span>
        //                             </Text>
        //                         </Col>
        //                     </>
        //                 }
        //                 {
        //                     !hasChange && <>
        //                         <Col span={24}>
        //                             <Text strong type='secondary'>
        //                                 <ERC20TokenAmount address={vo.token} name={erc20.name} symbol={erc20.symbol}
        //                                     decimals={erc20.decimals} raw={changeBefore30D} fixed={erc20.decimals} />
        //                                 <span style={{ marginLeft: "5px" }}>{erc20.symbol}</span>
        //                             </Text>
        //                         </Col>
        //                     </>
        //                 }
        //             </Row>

        //         </>
        //     },
        //     width: 140,
        // },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Percentage</Text>,
            dataIndex: 'percentage',
            render: (percentage, addressBalanceRankVO: ERC20AddressBalanceVO) => {
                let _percentage = percentage.substring(0, percentage.indexOf("%") - 1);
                return <>
                    <Text>{percentage}</Text>
                    <br />
                    <Progress percent={_percentage} showInfo={false} size="small" />
                </>
            },
            width: 80,
        },
    ];

    return <>
        <Col span={24}>
            <Title level={5}>Assets in Wallet()</Title>
        </Col>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
            loading={loading}
            pagination={pagination} rowKey={(vo) => vo.token}
        />
    </>

}