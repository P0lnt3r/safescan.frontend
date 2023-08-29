

import { Link as RouterLink } from 'react-router-dom';
import './index.css';
import { Card, Col, List, PaginationProps, Row, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { set } from 'date-fns';
import { fetchNftTokenInventory } from '../../services/assets';
import { NftTokenAssetVO } from '../../services';

const { Text, Link, Paragraph } = Typography;
const DEFAULT_PAGESIZE = 30;

export default ({ token }: { token: string }) => {
    const { t } = useTranslation();
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
        fetchNftTokenInventory(token, {
            current: pagination.current,
            pageSize: pagination.pageSize
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
                gutter: 16,xs: 2,sm: 2,md: 4,lg: 4,xl: 6,xxl: 6,
            }}
            dataSource={listData}
            pagination={pagination}
            renderItem={(tokenAsset) => (
                <List.Item>
                    <Card className='nft_item'>
                        <Row>
                            <Col span={24} style={{ textAlign: 'center', marginBottom: "24px" }}>
                                <img src='https://storage.googleapis.com/nftimagebucket/tokens/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/1553.png'></img>
                            </Col>
                            <Col span={24}>
                                <Text strong type='secondary' style={{ marginRight: "5px" }}>Token ID:</Text>
                                <Tooltip title={tokenAsset.tokenId}>
                                    <RouterLink to={``}>
                                        <Link ellipsis>{tokenAsset.tokenId}</Link>
                                    </RouterLink>
                                </Tooltip>
                            </Col>
                            {
                                tokenAsset.owner &&
                                <Col span={24}>
                                    <Row>
                                        <Col span={5}>
                                            <Text strong type='secondary' style={{ marginRight: "5px" }}>Owner:</Text>
                                        </Col>
                                        <Col span={19}>
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