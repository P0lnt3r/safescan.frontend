import { Col, Divider, Row, Typography, Input, Select, Button, Tag, Card, Alert, Collapse } from "antd";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import { useState } from "react";
import { useLocation } from "react-router";
import { contractCompile } from "../../services/verify";
import { Link as RouterLink } from 'react-router-dom';
import Address from "../../components/Address";
import { EvmVersionOptions, LicenseOptions } from "./verify_option_config";

const { Text, Link } = Typography;
const { TextArea } = Input;

export default ({ verifyParams, setVerifyParams, setVerifyResult }: {

    verifyParams: {
        contractAddress: string | null,
        compileType : string | null,
        compileVersion: string | null,
        standardInputJson: string | null,
        license: string | null,
    },

    setVerifyParams: ({ }: any) => void,
    setVerifyResult: ({ }: any) => void

}) => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [params, setParams] = useState<{
        contractAddress: string | null,
        compileType:string | null,
        compileVersion: string | null,
        standardInputJson : string | null,
        license: string | null,
    }>(verifyParams);
    const [errCode, setErrCode] = useState();

    const licenseSelectChange = (license: string) => {
        setParams({
            ...params,
            license
        })
    }
    const standardInputJsonTextAreaChange = (event: any) => {
        setParams({
            ...params,
            standardInputJson: event.target.value
        })
    }

    const verifyAndPublicClick = () => {
        if (params.standardInputJson) {
            setVerifyParams(params)
            contractCompile({
                ...params
            }).then((data: any) => {
                if (data.result == "err_1002") {
                    setErrCode(data.result)
                } else {
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
                        1. Contract sources in the json file must be formatted as Literal contents and NOT as urls
                    </Text>
                    <br />
                    <Text type="secondary" strong>
                        2. Use multiple literal { `{"content": "", ... }`} for multi part contracts containing multiple source files
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
            </Row>

            <Row style={{ marginTop: "20px" }}>
                <Col span={24}>
                    <Text strong style={{ fontSize: "16px" }}>Enter the Standard-Json-Input Code below
                        <Text style={{ marginLeft: "4px" }} strong type="danger">*</Text>
                    </Text>
                    <br />
                    <TextArea onChange={standardInputJsonTextAreaChange} style={{ marginTop: "12px", width: "100%", borderRadius: "8px", minHeight: "300px" }} />
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
                    <p></p>
                </CollapsePanel>
                <CollapsePanel header={<>
                    <Text style={{ fontSize: "16px" }}>Misc Settings</Text>
                    <Text style={{ fontSize: "16px" }} type="secondary">(Runs, EvmVersion & License Type settings)</Text>
                </>} key="3">
                    <Row>
                        <Col span={7}>
                            <Text style={{ fontSize: "16px" }}>LicenseType</Text>
                            <br />
                            <Select
                                size="large"
                                defaultValue={params.license}
                                style={{ width: "100%" }}
                                options={LicenseOptions}
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