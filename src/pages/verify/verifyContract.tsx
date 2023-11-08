import { Col, Divider, Row, Typography, Input, Select, Button } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ChecksumAddress } from "../../components/Address";

const { Text } = Typography;

export default () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const paramAddress = searchParams.get('a');
    const navigator = useNavigate();

    const contractInputRef = useRef(null);
    const compileSelectRef = useRef(null);
    const licenseSelectRef = useRef(null);

    const [params, setParams] = useState<{
        contractAddress: string | undefined,
        compile: string | undefined,
        license: string | undefined
    }>({
        contractAddress: undefined,
        compile: undefined,
        license: undefined
    });

    useEffect(() => {
        if (paramAddress) {
            setParams({
                contractAddress: ChecksumAddress(paramAddress),
                compile: undefined,
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

    const submitClick = () => {
        if ( params.contractAddress && params.compile && params.license ){
            let _compile = params.compile.replace("+" , "%2b");
            navigator(`/verifyContract-solc?a=${params.contractAddress}&c=${_compile}&licenseType=${params.license}`)
        }
    }
    const resetClick = () => {

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

                    <Input value={params?.contractAddress ? params?.contractAddress : undefined} ref={contractInputRef}
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
                        ref={compileSelectRef}
                        size="large"
                        defaultValue="[Please Select]"
                        style={{ width: "100%" }}
                        options={[
                            { value: '', label: '[Please Select]' },
                            { value: 'v0.8.9+commit.e5eed63a', label: 'v0.8.9+commit.e5eed63a' },
                            { value: 'v0.8.8+commit.dddeac2f', label: 'v0.8.8+commit.dddeac2f' },
                            { value: 'v0.8.7+commit.e28d00a7', label: 'v0.8.7+commit.e28d00a7' },
                            { value: 'v0.8.6+commit.11564f7e', label: 'v0.8.6+commit.11564f7e' },
                            { value: 'v0.6.6+commit.6c089d02', label: 'v0.6.6+commit.6c089d02' },
                        ]}
                        onChange={compileSelectChange}
                    />
                </Col>

                <Col span={24} style={{ marginTop: "16px" }}>
                    <Text strong>Please select Open Source License Type</Text>
                    <br />
                </Col>

                <Col span={24}>
                    <Select
                        ref={licenseSelectRef}
                        size="large"
                        defaultValue="[Please Select]"
                        style={{ width: "100%" }}
                        options={[
                            { value: '', label: '[Please Select]' },
                            { value: '1', label: '1) No License (None)' },
                            { value: '2', label: '2) The Unlicense (Unlicense)' },
                            { value: '3', label: '3) MIT License (MIT)' },
                            { value: '4', label: '4) GNU General Public License v2.0 (GNU GPLv2)' },
                            { value: '5', label: '5) GNU General Public License v3.0 (GNU GPLv3)' },
                            { value: '6', label: '6) GNU Lesser General Public License v2.1 (GNU LGPLv2.1)' },
                            { value: '7', label: '7) GNU Lesser General Public License v3.0 (GNU LGPLv3)' },
                            { value: '8', label: '8) BSD 2-clause "Simplified" license (BSD-2-Clause)' },
                            { value: '9', label: '9) BSD 3-clause "New" Or "Revised" license (BSD-3-Clause)' },
                            { value: '10', label: '10) Mozilla Public License 2.0 (MPL-2.0)' },
                            { value: '11', label: '11) Open Software License 3.0 (OSL-3.0)' },
                            { value: '12', label: '12) Apache 2.0 (Apache-2.0)' },
                            { value: '13', label: '13) GNU Affero General Public License (GNU AGPLv3)' },
                            { value: '14', label: '14) Business Source License (BSL 1.1)' },
                        ]}
                        onChange={licenseSelectChange}
                    />
                </Col>

                <Col span={24} style={{ textAlign: "center", marginTop: "20px" }}>
                    <Button onClick={submitClick} size="large" type="primary" style={{ marginRight: "2px", borderRadius: "8px" }}>
                        Submit
                    </Button>
                    <Button size="large" style={{ marginLeft: "2px", borderRadius: "8px" }}>
                        Reset
                    </Button>
                </Col>

            </Row>
        </div>

    </>

}