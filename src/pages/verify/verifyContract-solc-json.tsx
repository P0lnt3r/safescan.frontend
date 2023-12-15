import { Col, Divider, Row, Typography, Input, Select, Button, Tag, Card, Alert, Collapse, TabsProps, Tabs } from "antd";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import { contractCompile } from "../../services/verify";
import VerifyContractSolcContractcode from "./verifyContract-solc-contractcode";
import VerifyContractSolcJsonInput from "./verifyContract-solc-json-input";
import VerifyContractSolcJsonCompileroutput from "./verifyContract-solc-compileroutput";
import VerifyContractSolcCompileroutput from "./verifyContract-solc-compileroutput";

const { Text } = Typography;

export default () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const contractAddress = searchParams.get("a");
    const compile = searchParams.get("c");
    const license = searchParams.get("license");

    const [verifyParams, setVerifyParams] = useState<{
        contractAddress: string | null,
        compileType: string | null,
        compileVersion: string | null,
        optimizerEnabled: boolean,
        optimizerRuns: string,
        contractSourceCode: string | undefined,
        license: string | null,
        evmVersion: string | undefined,
        standardInputJson : string | null,
    }>({
        contractAddress: contractAddress,
        compileVersion: compile,
        optimizerEnabled: false,
        optimizerRuns: "200",
        compileType : "standardInputJson",
        contractSourceCode: undefined,
        license: license,
        evmVersion: undefined,
        standardInputJson : null
    });
    const [verifyResult, setVerifyResult] = useState<{
        output: any,
        result: any
    }>();

    const [tabActiveKey, setTabActiveKey] = useState<string>("contractCode");
    const items = useMemo<TabsProps['items']>(() => {
        const items = [
            {
                key: 'contractCode',
                label: 'Contract Code',
                children: <VerifyContractSolcJsonInput verifyParams={verifyParams}
                    setVerifyResult={setVerifyResult} setVerifyParams={setVerifyParams}
                />
            }
        ]
        if (verifyResult?.output) {
            items.push({
                key: 'compilerOutput',
                label: 'Compiler Output',
                children: <VerifyContractSolcCompileroutput verifyParams={verifyParams} verifyResult={verifyResult} />
            })
            setTabActiveKey("compilerOutput")
        }
        return items;
    }, [verifyParams, verifyResult]);


    return <>
        <div style={{ textAlign: "center", marginTop: "12px" }}>
            <Text strong style={{ fontSize: "24px" }}>Verify & Publish Contract Source Code </Text>
            <br />
            <Tag style={{ borderRadius: "8px", color: "#00a186", backgroundColor: "rgba(var(--bs-success-rgb),var(--bs-bg-opacity))" }}>
                <span style={{ fontWeight: "bold" }}>Compiler Type: SINGLE FILE / CONCATENANTED METHOD</span>
            </Tag>
            <Divider />
        </div>
        <Tabs activeKey={tabActiveKey} items={items} onChange={setTabActiveKey} />
    </>

}