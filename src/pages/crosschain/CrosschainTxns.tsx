
import { Avatar, Card, Col, Divider, Input, List, Row, Skeleton, Spin, Typography } from "antd"
import CrosschainElement from "./CrosschainElement";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { fetchCrosschains } from "../../services/crosschain";
import { CrossChainVO } from "../../services";
import { ethers } from "ethers";

export default () => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<CrossChainVO[]>([]);
    const [queryKey, setQueryKey] = useState<string>();

    const [page, setPage] = useState<{
        current: number,
        pageSize: number,
        total?: number,
        totalPages?: number
    }>({
        current: 1,
        pageSize: 20
    });

    const loadMoreData = (reload?: boolean) => {
        if (loading) {
            return;
        }
        let address = undefined;
        let txHash = undefined;
        if (queryKey) {
            address = ethers.utils.isAddress(queryKey) ? queryKey : undefined;
            txHash = ethers.utils.isAddress(queryKey) ? undefined : queryKey;
        }
        setLoading(true);
        fetchCrosschains({
            current: reload ? 1 : page.current,
            pageSize: page.pageSize,
            address, txHash
        })
            .then((pageResponse) => {
                const { current, pageSize, records, totalPages, total } = pageResponse;
                if (current == 1) {
                    setData([...records]);
                } else {
                    setData([...data, ...records]);
                }
                setLoading(false);
                setPage({
                    current: current + 1,
                    pageSize,
                    total, totalPages
                });
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadMoreData();
    }, []);

    const doQuery = () => {
        loadMoreData(true);
    }

    return <>
        <Card title="Txns" style={{minHeight:"1000px"}}>
            <Row style={{ marginBottom: "20px" }}>
                <Col xs={24} xl={12}>
                    <Input.Search value={queryKey} placeholder="Address | Transaction Hash" size="large" onChange={(event) => {
                        const input = event.target.value;
                        setQueryKey(input.trim())
                    }} onSearch={doQuery} />
                </Col>
            </Row>

            <div
                id="scrollableDiv"
                style={{
                    maxHeight: 1200,
                    overflow: 'auto',
                    width: "100%"
                }}
            >
                <Spin spinning={loading}>
                    <InfiniteScroll
                        dataLength={data.length}
                        next={loadMoreData}
                        hasMore={page.total ? data.length < page.total : true}
                        loader={<></>}
                        endMessage={<Divider plain>It's All.</Divider>}
                        scrollableTarget="scrollableDiv"
                    >
                        <List
                            dataSource={data}
                            renderItem={(item) => (
                                <List.Item key={item.srcTxHash}>
                                    <CrosschainElement crosschainVO={item} />
                                </List.Item>
                            )}
                        />
                    </InfiniteScroll>
                </Spin>
            </div>
        </Card>
    </>

}