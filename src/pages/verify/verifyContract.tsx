import { Col, Divider, Row, Typography, Input, Select, Button } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ChecksumAddress } from "../../components/Address";
import { CompileTypeOptions, LicenseOptions, SolcCompileVersionOptions } from "./verify_option_config";

const { Text } = Typography;

export default () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const paramAddress = searchParams.get('a');
    const navigator = useNavigate();

    const [params, setParams] = useState<{
        contractAddress: string | undefined,
        compileType: string | undefined,
        compile: string | undefined,
        license: string | undefined
    }>({
        contractAddress: undefined,
        compileType: undefined,
        compile: undefined,
        license: undefined
    });

    useEffect(() => {
        if (paramAddress) {
            setParams({
                contractAddress: ChecksumAddress(paramAddress),
                compile: undefined,
                compileType: undefined,
                license: undefined
            })
        }
    }, [paramAddress]);

    const contractAddressInputChange = (e: any) => {
        setParams({
            ...params,
            contractAddress: e.target.value
        })
    }
    const compileSelectChange = (version: string) => {
        setParams({
            ...params,
            compile: version ? version : undefined
        })
    }
    const licenseSelectChange = (license: string) => {
        setParams({
            ...params,
            license: license ? license : undefined
        })
    }
    const compileTypeSelectChange = (compileType: string) => {
        setParams({
            ...params,
            compileType: compileType ? compileType : undefined
        })
    }

    const submitClick = () => {
        if (params.contractAddress && params.compileType && params.compile && params.license) {
            let _compile = params.compile.replace("+", "%2b");
            if (params.compileType == "Solidity(Single File)") {
                navigator(`/verifyContract-solc?a=${params.contractAddress}&c=${_compile}&license=${params.license}`)
            }else if (params.compileType == "Solidity(Standard-Json-Input)"){
                navigator(`/verifyContract-solc-json?a=${params.contractAddress}&c=${_compile}&license=${params.license}`)
            }
        }
    }

    const resetClick = () => {
        setParams({
            contractAddress: params.contractAddress ? params.contractAddress : undefined,
            compileType: '',
            compile: '',
            license: ''
        })
    }

    return <>
        <div style={{ textAlign: "center", marginTop: "12px" }}>
            <Text strong style={{ fontSize: "24px" }}>Verify & Publish Contract Source Code </Text>
            <br />
            <Text type="secondary" strong >COMPILER TYPE AND VERSION SELECTION</Text>
            <Divider />
            <div style={{ width: "70%", margin: "auto" }}>
                <Text>
                    Source code verification provides transparency for users interacting with smart contracts. By uploading the source code, BscScan will match the compiled code with that on the blockchain. Just like contracts, a "smart contract" should provide end users with more information on what they are "digitally signing" for and give users an opportunity to audit the code to independently verify that it actually does what it is supposed to do.
                </Text>
                <br /><br /><br />
                <Text>
                    Please be informed that advanced settings (e.g. bytecodeHash: "none" or viaIR: "true") can be accessed via Solidity (Standard-Json-Input) verification method. More information can be found under Solidity's "Compiler Input and Output JSON Description" documentation section.
                </Text>
            </div>
        </div>

        <div style={{ marginTop: "12px", margin: "auto", width: "40%", paddingTop: "50px" }}>
            <Row>
                <Col span={24}>
                    <Text strong>Please enter the Contract Address you would like to verify</Text>
                    <br />
                </Col>
                <Col span={24}>

                    <Input value={params?.contractAddress ? params?.contractAddress : undefined}
                        style={{ borderRadius: "8px", marginTop: "5px" }} placeholder="0x..." size="large"
                        onChange={contractAddressInputChange}
                    />
                </Col>

                <Col span={24} style={{ marginTop: "16px" }}>
                    <Text strong>Please select Compiler Type</Text>
                    <br />
                </Col>
                <Col span={24}>
                    <Select
                        size="large"
                        defaultValue="[Please Select]"
                        value={params.compileType}
                        style={{ width: "100%" }}
                        options={CompileTypeOptions}
                        onChange={compileTypeSelectChange}
                    />
                </Col>

                <Col span={24} style={{ marginTop: "16px" }}>
                    <Text strong>Please select Compiler Version</Text>
                    <br />
                </Col>
                <Col span={24}>
                    <Select
                        size="large"
                        defaultValue="[Please Select]"
                        value={params.compile}
                        style={{ width: "100%" }}
                        options={SolcCompileVersionOptions}
                        onChange={compileSelectChange}
                    />
                </Col>

                <Col span={24} style={{ marginTop: "16px" }}>
                    <Text strong>Please select Open Source License Type</Text>
                    <br />
                </Col>
                <Col span={24}>
                    <Select
                        size="large"
                        defaultValue="[Please Select]"
                        value={params.license}
                        style={{ width: "100%" }}
                        options={LicenseOptions}
                        onChange={licenseSelectChange}
                    />
                </Col>

                <Col span={24} style={{ textAlign: "center", marginTop: "20px" }}>
                    <Button onClick={submitClick} size="large" type="primary" style={{ marginRight: "2px", borderRadius: "8px" }}>
                        Submit
                    </Button>
                    <Button onClick={resetClick} size="large" style={{ marginLeft: "2px", borderRadius: "8px" }}>
                        Reset
                    </Button>
                </Col>

            </Row>
        </div>

    </>

}