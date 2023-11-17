import { Col, Divider, Row, Typography, Input, Select, Button, Tag, Card, Alert, Collapse } from "antd";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import { useState } from "react";
import { useLocation } from "react-router";
import { contractCompile } from "../../services/verify";
import { Link as RouterLink } from 'react-router-dom';
import Address from "../../components/Address";

const { Text, Link } = Typography;
const { TextArea } = Input;

const evmVersionSelectOptions = [
    { value: "", label: "default (compiler defaults)" },
    { value: "homestead", label: "homestead (oldest version)" },
    { value: "tangerineWhistle", label: "tangerineWhistle" },
    { value: "spuriousDragon", label: "spuriousDragon" },
    { value: "byzantium", label: "byzantium (default for >= v0.5.4)" },
    { value: "constantinople", label: "constantinople" },
    { value: "petersburg", label: "petersburg (default for >= v0.5.5)" },
    { value: "istanbul", label: "istanbul (default for >= v0.5.14)" },
    { value: "berlin", label: "berlin (default for >= v0.8.5)" },
    { value: "london", label: "london (default for >= v0.8.7)" },
    { value: "paris", label: "paris (default for >=v0.8.18)" },
    { value: "shanghai", label: "shanghai (default for >=v0.8.20)" },
];

export default ({ verifyParams, setVerifyParams, setVerifyResult }: {
    verifyParams: {
        contractAddress: string | null,
        compileVersion: string | null,
        optimizerEnabled: boolean,
        optimizerRuns: string,
        contractSourceCode: string | undefined,
        license: string | undefined,
        evmVersion: string | undefined
    },
    setVerifyParams: ({ }: any) => void,
    setVerifyResult: ({ }: any) => void
}) => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const licenseType = searchParams.get("licenseType");

    const [params, setParams] = useState<{
        contractAddress: string | null,
        compileVersion: string | null,
        optimizerEnabled: boolean,
        optimizerRuns: string,
        contractSourceCode: string | undefined,
        license: string | undefined,
        evmVersion: string | undefined
    }>(verifyParams);
    const [errCode, setErrCode] = useState();

    const optimizationSelectChange = (optimizerEnabled: boolean) => {
        setParams({
            ...params,
            optimizerEnabled: optimizerEnabled
        })
    }
    const runsInputChange = (event: any) => {
        setParams({
            ...params,
            optimizerRuns: event.target.value
        })
    }
    const evmVersionSelectChange = (evmVersion: string) => {
        setParams({
            ...params,
            evmVersion
        })
    }
    const licenseSelectChange = (license: string) => {
        setParams({
            ...params,
            license
        })
    }
    const contractSourceCodeTextAreaChange = (event: any) => {
        setParams({
            ...params,
            contractSourceCode: event.target.value
        })
    }

    const verifyAndPublicClick = () => {
        if (params.contractSourceCode) {
            setVerifyParams(params)
            contractCompile({
                ...params
            }).then((data: any) => {
                if ( data.result == "err_1002" ){
                    setErrCode(data.result)
                }else{
                    setVerifyResult(data)
                }
            })
        }
    }

    return <>
        <Card>

            {
                errCode && errCode == "err_1002" &&
                <Alert type="error" style={{
                    borderRadius: "12px",
                    backgroundColor: "rgb(255, 160, 170)",
                    border: "8px solid rgb(255, 160, 170)",
                    marginBottom: "40px"
                }} message={<>
                    <Text strong style={{
                        color: "#b02a37"
                    }}>Error! Unable to locate Contract Code at <RouterLink to={`/address/${verifyParams.contractAddress}`}><Link strong style={{
                        marginLeft: "5px"
                    }}>
                        {verifyParams.contractAddress && <>
                            {
                                verifyParams.contractAddress
                            }</>}
                    </Link></RouterLink><br />
                        Is this a valid Contract Address ?</Text>
                </>} />
            }

            <Alert
                message={<>
                    <Text type="secondary" strong>
                        1. A simple and structured interface for verifying smart contracts that fit in a single file
                    </Text>
                    <br />
                    <Text type="secondary" strong>
                        2. If the contract compiles correctly at REMIX, it should also compile correctly here.
                    </Text>
                </>}
                closable
                style={{
                    borderRadius: "12px",
                    backgroundColor: "#e5e5e5",
                    border: "8px solid #e5e5e5"
                }}
            />

            <Row style={{ marginTop: "20px" }}>
                <Col span={9}>
                    <Text style={{ fontSize: "16px" }}>Contract Address</Text>
                    <br />
                    <Input value={params.contractAddress ? params.contractAddress : ""} disabled size="large" style={{ borderRadius: "8px", marginTop: "12px" }}></Input>
                </Col>
                <Col offset={1} span={9}>
                    <Text style={{ fontSize: "16px" }}>Compiler</Text>
                    <br />
                    <Select style={{ borderRadius: "8px", marginTop: "12px", width: "100%" }}
                        value={params.compileVersion ? params.compileVersion : ""}
                        disabled size="large"
                    >
                    </Select>
                </Col>
                <Col offset={1} span={4}>
                    <Text style={{ fontSize: "16px" }}>Optimization</Text>
                    <br />
                    <Select style={{ borderRadius: "8px", marginTop: "12px", width: "100%" }}
                        size="large"
                        defaultValue={false}
                        options={[
                            { value: true, label: "Yes" },
                            { value: false, label: "No" }
                        ]}
                        onChange={optimizationSelectChange}
                    >
                    </Select>
                </Col>
            </Row>

            <Row style={{ marginTop: "20px" }}>
                <Col span={24}>
                    <Text strong style={{ fontSize: "16px" }}>Enter the Solidity Contract Code below
                        <Text style={{ marginLeft: "4px" }} strong type="danger">*</Text>
                    </Text>
                    <br />
                    <TextArea onChange={contractSourceCodeTextAreaChange} style={{ marginTop: "12px", width: "100%", borderRadius: "8px", minHeight: "300px" }} />
                </Col>
            </Row>
            <br /><br />

            <Collapse style={{
                borderRadius: "12px"
            }} defaultActiveKey={["3"]}>
                <CollapsePanel header={<>
                    <Text style={{ fontSize: "16px" }}>Constructor Arguments ABIEncoded</Text>
                    <Text style={{ fontSize: "16px" }} type="secondary">(for contracts that were created with constructor parameters)</Text>
                </>} key="1">
                    <p>111</p>
                </CollapsePanel>
                <CollapsePanel header={<>
                    <Text style={{ fontSize: "16px" }}>Contract Library Address</Text>
                    <Text style={{ fontSize: "16px" }} type="secondary">(for contracts that use libraries, supports up to 10 libraries)</Text>
                </>} key="2">
                    <p>222</p>
                </CollapsePanel>
                <CollapsePanel header={<>
                    <Text style={{ fontSize: "16px" }}>Misc Settings</Text>
                    <Text style={{ fontSize: "16px" }} type="secondary">(Runs, EvmVersion & License Type settings)</Text>
                </>} key="3">
                    <Row>
                        <Col span={7}>
                            <Text style={{ fontSize: "16px" }}>Runs</Text>
                            <br />
                            <Input value={params.optimizerRuns} onChange={runsInputChange} style={{ borderRadius: "8px", marginTop: "12px" }}></Input>
                        </Col>
                        <Col offset={1} span={7}>
                            <Text style={{ fontSize: "16px" }}>EVM Version to target</Text>
                            <br />
                            <Select style={{ borderRadius: "8px", marginTop: "12px", width: "100%" }}
                                defaultValue=""
                                options={evmVersionSelectOptions}
                                onChange={evmVersionSelectChange}
                            >
                            </Select>
                        </Col>
                        <Col offset={1} span={7}>
                            <Text style={{ fontSize: "16px" }}>LicenseType</Text>
                            <br />
                            <Select
                                size="large"
                                defaultValue={licenseType}
                                style={{ width: "100%" }}
                                options={[
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
                    </Row>
                </CollapsePanel>
            </Collapse>

            <Row>
                <Col span={24} style={{ textAlign: "center", marginTop: "60px", marginBottom: "60px" }}>
                    <Button onClick={verifyAndPublicClick} size="large" type="primary" style={{ marginRight: "4px", borderRadius: "8px" }}>
                        Verify And Publish
                    </Button>
                    <Button size="large" style={{ marginLeft: "4px", borderRadius: "8px" }}>
                        Reset
                    </Button>
                    <Button size="large" style={{ marginLeft: "8px", borderRadius: "8px" }}>
                        Return to Main
                    </Button>
                </Col>
            </Row>

        </Card>

    </>

}