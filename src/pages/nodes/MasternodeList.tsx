import { Table, Typography, Row, Col, Input, Alert, TablePaginationConfig } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MasterNodeVO } from "../../services";
import type { ColumnsType } from "antd/es/table";
import { FilterValue } from "antd/es/table/interface";
import EtherAmount from "../../components/EtherAmount";
import { fetchMasterNodes } from "../../services/node";
import Address from "../../components/Address";
import { isValidIP, isValidNodeID, MatchEnodeIP, RenderNodeState } from "./Utils";
import { ethers } from "ethers";

const { Text } = Typography;
const DEFAULT_PAGESIZE = 10;

export default function MasternodeList() {
    const [searchParams, setSearchParams] = useSearchParams();

    const current = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGESIZE);
    const address = searchParams.get("address") || undefined;
    const idParam = searchParams.get("id");
    const id = idParam && !Number.isNaN(Number(idParam)) ? Number(idParam) : undefined;
    const ip = searchParams.get("ip") || undefined;
    const states = useMemo(
        () => searchParams.get("states")?.split(",").map(Number),
        [searchParams]
    );

    const [queryInput, setQueryInput] = useState("");
    const [queryInputError, setQueryInputError] = useState<string>();
    const [tableData, setTableData] = useState<MasterNodeVO[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const searchDisplayValue = address ?? (id !== undefined ? String(id) : undefined) ?? ip ?? "";

    useEffect(() => {
        setQueryInput(searchDisplayValue);
    }, [searchDisplayValue]);

    useEffect(() => {
        setLoading(true);
        fetchMasterNodes({
            current,
            pageSize,
            address,
            id,
            ip,
            states,
        }).then((data) => {
            setLoading(false);
            setTableData(data.records);
            setTotal(data.total);
        });
    }, [current, pageSize, address, id, ip, states]);

    const pagination: TablePaginationConfig = {
        current,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal: (t) => <Text strong>Total: {t}</Text>,
    };

    const columns: ColumnsType<MasterNodeVO> = [
        {
            title: <Text strong style={{ color: "#6c757e" }}>ID</Text>,
            dataIndex: "id",
            render: (nodeId) => <Text strong>{nodeId}</Text>,
            width: "100px",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>State</Text>,
            dataIndex: "state",
            render: (state) => RenderNodeState(state),
            width: "100px",
            filters: [
                { text: "INITIALIZE", value: "0" },
                { text: "ENABLED", value: "1" },
                { text: "ERROR", value: "2" },
            ],
            filteredValue: states?.map(String) ?? null,
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Address</Text>,
            dataIndex: "addr",
            render: (addr) => (
                <Address
                    address={addr}
                    style={{ hasLink: true, ellipsis: false }}
                    to={`/node/${addr}`}
                />
            ),
            width: "200px",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>IP</Text>,
            dataIndex: "enode",
            render: (enode) => <Text strong ellipsis>{MatchEnodeIP(enode)}</Text>,
            width: "100px",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Description</Text>,
            dataIndex: "description",
            render: (description) => (
                <Text title={description} type="secondary" style={{ width: "300px" }} ellipsis>
                    {description}
                </Text>
            ),
            width: "300px",
        },
        {
            title: <Text strong style={{ color: "#6c757e" }}>Amount</Text>,
            dataIndex: "totalAmount",
            render: (totalAmount) => (
                <Text strong>
                    <EtherAmount raw={totalAmount} fix={18} />
                </Text>
            ),
            width: "150px",
        },
    ];

    const doQuery = useCallback(
        (value: string) => {
            setQueryInputError(undefined);

            if (!value) {
                setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set("page", "1");
                    next.delete("address");
                    next.delete("id");
                    next.delete("ip");
                    return next;
                });
                return;
            }

            const isAddress = ethers.utils.isAddress(value);
            const isIdNumber = isValidNodeID(value);
            const isIp = isValidIP(value);

            if (!isAddress && !isIdNumber && !isIp) {
                setQueryInputError("Please enter a valid ID, IP or address");
                return;
            }

            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set("page", "1");
                next.delete("address");
                next.delete("id");
                next.delete("ip");
                if (isAddress) next.set("address", value);
                if (isIdNumber) next.set("id", String(Number.parseInt(value)));
                if (isIp) next.set("ip", value);
                return next;
            });
        },
        [setSearchParams]
    );

    const handleTableChange = (
        page: TablePaginationConfig,
        filters: Record<string, FilterValue | null>
    ) => {
        const newStates = (filters.state as string[] | null)?.join(",") ?? "";
        const oldStates = searchParams.get("states") ?? "";
        const filterChanged = newStates !== oldStates;

        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (filterChanged) {
                next.set("page", "1");
            } else if (page.current) {
                next.set("page", String(page.current));
            }
            if (page.pageSize) next.set("pageSize", String(page.pageSize));
            if (newStates) {
                next.set("states", newStates);
            } else {
                next.delete("states");
            }
            return next;
        });
    };

    return (
        <>
            <Row>
                <Col span={8}>
                    <Input.Search
                        size="large"
                        placeholder="ID|Address|IP"
                        value={queryInput}
                        onSearch={doQuery}
                        onChange={(event) => {
                            setQueryInputError(undefined);
                            setQueryInput(event.target.value);
                        }}
                    />
                    {queryInputError && (
                        <Alert
                            style={{ marginTop: "5px" }}
                            showIcon
                            type="error"
                            message={queryInputError}
                        />
                    )}
                </Col>
            </Row>
            <Table
                loading={loading}
                columns={columns}
                dataSource={tableData}
                scroll={{ x: 800 }}
                rowKey={(vo) => vo.id}
                pagination={pagination}
                onChange={handleTableChange}
                style={{ marginTop: "20px" }}
            />
        </>
    );
}
