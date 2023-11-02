

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import './index.css';
import { Card, Col, List, PaginationProps, Row, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { set } from 'date-fns';
import { fetchNftTokenInventory } from '../../services/assets';
import { NftTokenAssetVO } from '../../services';
import NFT_URI_IMG, { NFT_URI_IMG_SIZE } from '../../components/NFT_URI_IMG';

const { Text, Link, Paragraph } = Typography;
const DEFAULT_PAGESIZE = 30;

export default ({ token }: { token: string }) => {
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
        showTotal: (total) => <>Total : {total}</>,
        onChange: paginationOnChange
    });

    async function doFetchTokenInventory() {
        setLoading(true);
        fetchNftTokenInventory({
            current: pagination.current,
            pageSize: pagination.pageSize,
            token: token
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
    }, [token])

    return <>
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
                                <NFT_URI_IMG uri={tokenAsset.tokenURI}
                                    size={NFT_URI_IMG_SIZE.MIDDLE}
                                    onClick={() => {
                                        navigate(`/nft/${tokenAsset.token}/${tokenAsset.tokenId}`)
                                    }} />
                            </Col>
                            <Col span={24}>
                                <Text strong type='secondary' style={{ marginRight: "5px" }}>Token ID:</Text>
                                <Tooltip title={tokenAsset.tokenId}>
                                    <RouterLink to={`/nft/${tokenAsset.token}/${tokenAsset.tokenId}`}>
                                        <Link ellipsis>{tokenAsset.tokenId}</Link>
                                    </RouterLink>
                                </Tooltip>
                            </Col>
                            {
                                tokenAsset.owner &&
                                <Col span={24}>
                                    <Row>
                                        <Col span={6}>
                                            <Text strong type='secondary' style={{ marginRight: "5px" }}>Owner:</Text>
                                        </Col>
                                        <Col span={18}>
                                            <Tooltip title={tokenAsset.owner}>
                                                <Paragraph style={{
                                                    width: "95%",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    cursor: "pointer",
                                                    color: "#1890ff",
                                                    transition: "color 0.3s"
                                                }} copyable ellipsis onClick={() => {
                                                    console.log("click!!!")
                                                }}>
                                                    {tokenAsset.owner}
                                                </Paragraph>
                                            </Tooltip>

                                        </Col>
                                    </Row>
                                </Col>
                            }
                        </Row>

                    </Card>
                </List.Item>
            )}
        />
    </>

}