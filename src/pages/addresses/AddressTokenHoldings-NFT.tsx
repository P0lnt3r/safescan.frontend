import { Link as RouterLink, useNavigate } from 'react-router-dom';
import './index.css';
import { Card, Col, List, PaginationProps, Row, Tag, Tooltip, Typography, Badge } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { set } from 'date-fns';
import { fetchNftTokenInventory } from '../../services/assets';
import { NftTokenAssetVO } from '../../services';
import { NFT_Type_Label } from '../../utils/NFTUtils';

const { Text, Link, Paragraph, Title } = Typography;
const DEFAULT_PAGESIZE = 12;

export default ({ address }: { address: string }) => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [listData, setListData] = useState<NftTokenAssetVO[]>([]);

    function paginationOnChange(current: number, pageSize: number) {
        pagination.current = current;
        doFetchTokenInventory();
    }
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: DEFAULT_PAGESIZE,
        onChange: paginationOnChange
    });

    async function doFetchTokenInventory() {
        setLoading(true);
        fetchNftTokenInventory({
            current: pagination.current,
            pageSize: pagination.pageSize,
            address: address
        }).then(data => {
            setLoading(false);
            setPagination({
                ...pagination,
                current: data.current,
                pageSize: data.pageSize,
                total: data.total,
                onChange: paginationOnChange,
            })
            setListData(data.records);
        })
    }

    useEffect(() => {
        doFetchTokenInventory();
    }, [address])

    return <>
        <Col span={24}>
            <Title level={5}>NFT Assets ({pagination.total})</Title>
        </Col>
        <Card>
            <List
                loading={loading}
                grid={{
                    gutter: 16, xs: 2, sm: 2, md: 4, lg: 4, xl: 6, xxl: 6,
                }}
                dataSource={listData}
                pagination={pagination}
                renderItem={(tokenAsset) => (
                    <List.Item>
                        <Card className='nft_item'>
                            <Row>
                                <Col span={24} style={{ textAlign: 'center', marginBottom: "24px" }}>
                                    <Badge.Ribbon text={
                                        <Text strong style={{ fontSize: "10px", color: "white" }}>
                                            {NFT_Type_Label(tokenAsset.tokenType)}
                                        </Text>
                                    } color={tokenAsset.tokenType == "erc721" ? "cyan" : "green"}
                                        style={{ top: "-10px", lineHeight: "18px" }}>
                                        <img src='https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/1553.png'
                                                style={{
                                                    cursor:"pointer"
                                                }}
                                                onClick={() => {
                                                    navigate(`/nft/${tokenAsset.token}/${tokenAsset.tokenId}`)
                                                }}></img>
                                    </Badge.Ribbon>
                                </Col>
                                <Col span={24}>
                                    <Text strong type='secondary' style={{ marginRight: "5px" }}>Token:</Text>
                                    <Tooltip title={tokenAsset.token}>
                                        <RouterLink to={`/token/${tokenAsset.token}`}>
                                            <Link ellipsis>{tokenAsset.tokenPropVO.prop && JSON.parse(tokenAsset.tokenPropVO.prop).name}</Link>
                                        </RouterLink>
                                    </Tooltip>
                                </Col>
                                <Col span={24}>
                                    <Text strong type='secondary' style={{ marginRight: "5px" }}>Token ID:</Text>
                                    <Tooltip title={tokenAsset.tokenId}>
                                        <RouterLink to={`/nft/${tokenAsset.token}/${tokenAsset.tokenId}`}>
                                            <Link ellipsis>{tokenAsset.tokenId}</Link>
                                        </RouterLink>
                                    </Tooltip>
                                </Col>
                            </Row>

                        </Card>
                    </List.Item>
                )}
            />
        </Card>

    </>

}