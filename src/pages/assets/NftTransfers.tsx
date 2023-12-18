
import { Card, Table, Typography, Row, Col, Tooltip, PaginationProps, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressBalanceRank } from '../../services/address';
import { AddressBalanceRankVO, NftTokenVO, NftTransferVO } from '../../services';
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
import { fetchNftTokens } from '../../services/assets';
import { fetchNftTransfers, fetchTransactions } from '../../services/tx';
import TransactionHash from '../../components/TransactionHash';
import { DateFormat } from '../../utils/DateUtil';
import ERC20Logo from '../../components/ERC20Logo';
import { useTranslation } from 'react-i18next';
import TxMethodId from '../../components/TxMethodId';
import Address from '../../components/Address';
import NFTLogo from '../../components/NFTLogo';
import NFT_URI_IMG, { NFT_URI_IMG_SIZE } from '../../components/NFT_URI_IMG';

const { Title, Text, Link } = Typography;
const DEFAULT_PAGESIZE = 20;

export default () => {

    const { t } = useTranslation();
    const [tableData, setTableData] = useState<NftTransferVO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [unconfirmed, setUnconfirmed] = useState<number>(0);
    const [confirmed, setConfirmed] = useState<number>(0);

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        position: ["topRight", "bottomRight"],
        pageSizeOptions: [],
        responsive: true,
    });

    async function doFetchERC721Transfers() {
        setLoading(true)
        fetchNftTransfers({
            current: pagination.current,
            pageSize: pagination.pageSize,
        }).then(data => {
            setLoading(false)
            setTableData(data.records);
            const unconfirmed = [];
            data.records.forEach(tx => {
                if (tx.confirmed != 1) {
                    unconfirmed.push(tx);
                }
            })
            setConfirmed(data.total);
            setUnconfirmed(unconfirmed.length);
            const onChange = (page: number, pageSize: number) => {
                pagination.pageSize = unconfirmed.length > 0 ? pageSize - unconfirmed.length : pageSize;
                pagination.current = page;
                doFetchERC721Transfers();
            }
            if (pagination.current == 1) {
                const total = data.total;
                const dbSize = data.pageSize;
                const dbPages = Math.floor(total / dbSize);
                const uiTotal = (dbPages * unconfirmed.length) + total;
                setPagination({
                    ...pagination,
                    current: data.current,
                    total: uiTotal,
                    pageSize: data.records.length,
                    onChange: onChange
                })
            } else {
                setPagination({
                    ...pagination,
                    current: data.current,
                    total: data.total,
                    pageSize: data.pageSize,
                    onChange: onChange
                })
            }
        })
    }

    useEffect(() => {
        pagination.current = 1;
        pagination.pageSize = DEFAULT_PAGESIZE;
        doFetchERC721Transfers();
    }, []);

    const columns: ColumnsType<NftTransferVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>Txn Hash</Text>,
            dataIndex: 'transactionHash',
            render: (val, txVO) => <><TransactionHash blockNumber={txVO.blockNumber} txhash={val} status={1}></TransactionHash></>,
            width: 150,
            fixed: 'left',
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Method ID</Text>,
            dataIndex: 'methodId',
            width: 100,
            render: (methodId, vo) => <>
                <TxMethodId methodId={methodId} address={vo.toContract} subType={vo.toContractPropVO.subType} />
            </>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Date Time</Text>,
            dataIndex: 'timestamp',
            width: 120,
            render: (val) => <>{DateFormat(val * 1000)}</>
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>From</Text>,
            dataIndex: 'from',
            width: 150,
            render: (from, txVO) => {
                return (
                    <>
                        <Address address={from} propVO={txVO.fromPropVO} />
                    </>
                )
            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>To</Text>,
            dataIndex: 'to',
            width: 150,
            render: (to, vo) =>
                <Address address={to} propVO={vo.toPropVO}></Address >

        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Type</Text>,
            dataIndex: 'tokenType',
            width: 120,
            render: (tokenType, vo) => {
                let showText = tokenType;
                if (tokenType == "erc721") {
                    showText = "ERC-721"
                }
                if (tokenType == "erc1155") {
                    showText = "ERC-1155"
                }
                return <>
                    <Tag style={{
                        height: "30px", lineHeight: "28px", borderRadius: "10px"
                    }}>{showText}</Tag>
                    {
                        tokenType == "erc1155" && <>
                            <Tag style={{
                                height: "30px", lineHeight: "28px", borderRadius: "10px", float:"right"
                            }}>x{vo.tokenValue}</Tag>
                        </>
                    }
                </>
            }
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Item</Text>,
            dataIndex: 'tokenImage',
            width: 150,
            render: (tokenImage, nftTransferVO) => {
                const { tokenId, tokenPropVO, token } = nftTransferVO;
                const nftProp = tokenPropVO && (tokenPropVO.subType == "erc721" || tokenPropVO.subType == "erc1155") ? tokenPropVO?.prop : undefined;
                const nft = nftProp ? JSON.parse(nftProp) : undefined;
                return (
                    <div style={{ fontSize: '14px' }}>
                        {
                            tokenPropVO && <>
                                <Row style={{ width: "100%" }}>
                                    <Col span={4}>
                                        <NFT_URI_IMG size={NFT_URI_IMG_SIZE.SMALL} uri={tokenImage} />
                                    </Col>
                                    <Col span={20}>
                                        <Col span={24}>
                                            <Tooltip title={`${nft.symbol}#${tokenId}`}>
                                                <RouterLink to={`/nft/${token}/${tokenId}`}>
                                                    <Link href='#' ellipsis style={{ width: '80%', marginLeft: "5px" }}>
                                                        {nft.symbol}#{tokenId}
                                                    </Link>
                                                </RouterLink>
                                            </Tooltip>
                                        </Col>
                                        <Col span={24}>
                                            <Tooltip title={`${token}|${nft.name}`}>
                                                <RouterLink to={`/token/${token}`}>
                                                    <Text type="secondary" ellipsis style={{ width: '80%', marginLeft: "5px" }}>
                                                        {nft.name}({nft.symbol})
                                                    </Text>
                                                </RouterLink>
                                            </Tooltip>
                                        </Col>
                                    </Col>
                                </Row>
                            </>
                        }
                    </div>
                )
            }
        },
    ];

    function OutputTotal() {
        return <>
            {
                <Text strong style={{ color: "#6c757e" }}>Total of {
                    confirmed && <>{format(confirmed + "")}</>
                } NFT Transfer Events
                    {unconfirmed > 0 && <Text type="secondary"> and {unconfirmed} unconfirmed</Text>}
                </Text>
            }
        </>
    }

    return (<>
        <Title level={3}>NFT Transfers</Title>
        <Card>
            <OutputTotal></OutputTotal>
            <Table columns={columns} dataSource={tableData} scroll={{ x: 800 }}
                pagination={pagination}
            />
        </Card>
    </>)
}