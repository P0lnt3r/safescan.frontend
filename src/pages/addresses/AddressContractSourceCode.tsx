import { Card, Typography, Tag, Input, Button, Space, Tooltip, Tabs, Row, Col, Divider, Modal, Alert } from 'antd';
import {
    CheckCircleFilled, ApiOutlined, CodeOutlined, HolderOutlined, OneToOneOutlined, BlockOutlined, InfoCircleFilled
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from "react";
import { AddressVO, Contract_Compile_Result_VO, MasterNodeVO, SuperNodeVO } from "../../services";
import { Link as RouterLink } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { fetchContractCompileResult } from "../../services/contract";
import { defaultAbiCoder, FunctionFragment, Interface, ParamType } from 'ethers/lib/utils';
import CodeHighlighter from './CodeHighlighter';

const { Title, Text, Paragraph, Link } = Typography;
const { TextArea } = Input;

export default ({ address }: {
    address: string
}) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [contractCompileResult, setContractCompileResult] = useState<Contract_Compile_Result_VO>();
    useEffect(() => {
        setLoading(true)
        fetchContractCompileResult(address).then(data => {
            setLoading(false);
            setContractCompileResult(data);
        })
    }, [address]);

    const deployedArgsAbiEncodeStringView = useMemo(() => {

        const argsAbiDecodeResult: {
            index: string,
            pName: string,
            pType: string,
            value: string
        }[] = [];
        const argsAbiEncodeResult: {
            index: string,
            value: string
        }[] = [];

        if (contractCompileResult?.abi && contractCompileResult?.deployedArgsAbiEncode) {
            const contractInterface = new Interface(contractCompileResult.abi);
            let constructor = undefined;
            for (let i in contractInterface.fragments) {
                if (contractInterface.fragments[i].type == "constructor") {
                    constructor = contractInterface.fragments[i];
                }
            }
            if (constructor) {
                const _inputs: Array<ParamType> = constructor.inputs;
                const _decode = defaultAbiCoder.decode(_inputs, "0x" + contractCompileResult.deployedArgsAbiEncode);
                for (let i in _inputs) {
                    const { name, type } = _inputs[i];
                    argsAbiDecodeResult.push({
                        index: i,
                        pName: name,
                        pType: type,
                        value: _decode[i]
                    })
                }
            }
        }
        if (contractCompileResult && contractCompileResult.deployedArgsAbiEncode) {
            const count = Math.ceil((contractCompileResult.deployedArgsAbiEncode.length) / 64);
            for (let i = 0; i < count; i++) {
                let endIndex = 64 * (i + 1);
                if (endIndex > contractCompileResult.deployedArgsAbiEncode.length) {
                    endIndex = contractCompileResult.deployedArgsAbiEncode.length
                }
                argsAbiEncodeResult.push({
                    index: i + "",
                    value: contractCompileResult.deployedArgsAbiEncode.substring(64 * i, endIndex)
                })
            }
        }
        let stringview = contractCompileResult?.deployedArgsAbiEncode;
        let decodeview = "";
        let encodeview = "";
        if (argsAbiDecodeResult.length > 0) {
            decodeview += `\n\n\-----Decoded View---------------\n`;
            for (let i in argsAbiDecodeResult) {
                const { index, pName, pType, value } = argsAbiDecodeResult[i];
                decodeview += `Arg  [${i}]  :  ${pName} (${pType}):${value}  \n`;
            }
        }
        if (argsAbiEncodeResult.length > 0) {
            decodeview += `\n\n\-----Encoded View---------------\n`;
            decodeview += `7 Constructor Arguments found :\n`;
            for (let i in argsAbiEncodeResult) {
                const { index, value } = argsAbiEncodeResult[i];
                decodeview += `Arg  [${i}]  :  :${value}  \n`;
            }
        }
        return stringview + decodeview + encodeview;
    }, [contractCompileResult]);

    const contractSources = useMemo(() => {
        const contractSources: any[] = [];
        const contractSourceName = contractCompileResult?.name;
        if ("standardInputJson" == contractCompileResult?.compileType) {
            const standardInput = JSON.parse(contractCompileResult?.sourceCodes);
            const sources = standardInput.sources;
            const mainContractFileName = contractSourceName.substring(
                0, contractSourceName.indexOf(":")
            )
            let files = 0;
            for (let _ in sources) {
                files++;
            }
            let i = 1;
            let theMainContract;
            for (let fileName in sources) {
                const _fileName = fileName.lastIndexOf("/") > -1 ? fileName.substring(fileName.lastIndexOf("/") + 1) : fileName;
                if (mainContractFileName == fileName) {
                    theMainContract = {
                        outputLabel: `File ${i} of ${files} : ${_fileName}`,
                        content: sources[fileName].content
                    }
                } else {
                    contractSources.push({
                        outputLabel: `File ${i} of ${files} : ${_fileName}`,
                        content: sources[fileName].content
                    });
                }
                i++;
            }
            if (theMainContract) {
                contractSources.unshift(theMainContract);
            }
            delete standardInput.sources;
            contractSources.push({
                outputLabel: "Settings",
                content: JSON.stringify(standardInput, null, 2)
            });
        }
        return contractSources;
    }, [contractCompileResult]);
    
    return <>
        {
            /** 没有进行合约源码验证 */
            !contractCompileResult?.sourceCodes && <>
                <Alert type='warning' message={
                    <>
                        <Text type="secondary"><InfoCircleFilled style={{ marginRight: "10px" }} /></Text>
                        Are you the contract creator?
                        <RouterLink to={`/verifyContract?a=${address}`}>
                            <Link strong style={{ marginLeft: "5px", marginRight: "5px" }}>
                                Verify and Publish
                            </Link>
                        </RouterLink>
                        your contract source code today!
                    </>
                } />
                <Row style={{ marginTop: "20px" }}>
                    <Text type="secondary"><HolderOutlined /></Text>
                    <Text strong style={{ marginLeft: "5px" }}>Contract Creation Code</Text>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                    <TextArea value={contractCompileResult?.creationBytecode}
                        style={{ width: "100%", borderRadius: "8px", minHeight: "200px", backgroundColor: "#f9f9f9", borderColor: "#ddd", fontFamily: "SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace" }} />
                </Row>
            </>
        }

        {
            /** 已经进行了合约源码验证 */
            contractCompileResult?.sourceCodes && <>
                <Alert message={
                    <>
                        <Text type="secondary"><InfoCircleFilled style={{ marginRight: "10px" }} /></Text>
                        A contract address hosts a smart contract, which is a set of code stored on the blockchain that runs when predetermined conditions are met.
                    </>
                } closable />
                <Row style={{ marginTop: "20px" }}>
                    <Text type="success"><CheckCircleFilled /></Text>
                    <Text strong style={{ marginLeft: "5px" }}>Contract Source Code Verified</Text>
                </Row>

                <Row>
                    <Col span={12} style={{ padding: "2% 2% 0% 0%" }}>
                        <Row>
                            <Col span={8}>Contract Name:</Col>
                            <Col span={16}>
                                <Text strong>{contractCompileResult?.name}</Text>
                            </Col>
                        </Row>
                        <Divider />
                        <Row>
                            <Col span={8}>Compiler Version:</Col>
                            <Col span={16}>
                                <Text strong>{contractCompileResult?.compileVersion}</Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12} style={{ padding: "2% 2% 0% 0%" }}>
                        <Row>
                            <Col span={8}>Optimization Enabled:</Col>
                            <Col span={16}>
                                <Text>
                                    <Text strong>{
                                        contractCompileResult?.optimizerEnabled ? "Yes" : "No"
                                    }</Text>
                                    {
                                        contractCompileResult?.optimizerEnabled && <>
                                            <Text> with
                                                <Text strong>{contractCompileResult.optimizerRuns}</Text>
                                                runs
                                            </Text>
                                        </>
                                    }
                                </Text>
                            </Col>
                        </Row>
                        <Divider />
                        <Row>
                            <Col span={8}>Other Settings:</Col>
                            <Col span={16}>
                                <Text>
                                    <Text strong>{
                                        contractCompileResult?.evmVersion ? contractCompileResult?.evmVersion : "default"
                                    }</Text> evmVersion ,
                                    <Text strong>{
                                        contractCompileResult?.license ? contractCompileResult?.license : "none"
                                    }</Text> license
                                </Text>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {
                    contractCompileResult?.sourceCodes && <>
                        <Row style={{ marginTop: "50px" }}>
                            <Text type="secondary"><CodeOutlined /></Text>
                            <Text strong style={{ marginLeft: "5px" }}>Contract Source Code<Text type="secondary">
                                (
                                Solidity
                                {
                                    "standardInputJson" == contractCompileResult?.compileType && <>
                                        <a style={{ marginLeft: "2px", marginRight: "2px" }} href='https://solidity.readthedocs.io/en/v0.5.8/using-the-compiler.html#compiler-input-and-output-json-description' target='_blank'>
                                            Standard Json-Input
                                        </a>
                                        format
                                    </>
                                }
                                )
                            </Text>
                            </Text>
                        </Row>
                        {
                            "standardInputJson" == contractCompileResult?.compileType && contractSources && <>
                                {
                                    contractSources.map((contractSourcecode: any) => {
                                        const {
                                            outputLabel,
                                            content
                                        } = contractSourcecode;
                                        return <>
                                            <div id={outputLabel} style={{ marginTop: "15px" }}>
                                                <Text type='secondary' strong>{outputLabel}</Text>
                                                <Row style={{ marginTop: "5px", maxHeight: "400px", overflow: "auto" }}>
                                                    {/* <SyntaxHighlighter style={atomOneLight} className="source_code_shower" showLineNumbers={true} >
                                                        {content}
                                                    </SyntaxHighlighter> */}
                                                    <CodeHighlighter  code={content} language='solidity' />
                                                </Row>
                                            </div>
                                        </>
                                    })
                                }
                            </>
                        }
                        {
                            "single" == contractCompileResult?.compileType && <>
                                <Row style={{ marginTop: "20px", maxHeight: "600px", overflow: "auto" }}>
                                    <SyntaxHighlighter style={atomOneLight} className="source_code_shower" showLineNumbers={true} >
                                        {contractCompileResult.sourceCodes}
                                    </SyntaxHighlighter>
                                </Row>
                            </>
                        }
                    </>
                }

                {/** Contract ABI */}
                <Row style={{ marginTop: "50px" }}>
                    <Text type="secondary"><ApiOutlined /></Text>
                    <Text strong style={{ marginLeft: "5px" }}>Contract ABI</Text>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                    <TextArea value={contractCompileResult?.abi}
                        style={{ width: "100%", borderRadius: "8px", minHeight: "200px", backgroundColor: "#f9f9f9", borderColor: "#ddd", fontFamily: "SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace" }} />
                </Row>

                {/** Contract Creation Code */}
                {
                    contractCompileResult?.creationBytecode && <>
                        <Row style={{ marginTop: "50px" }}>
                            <Text type="secondary"><HolderOutlined /></Text>
                            <Text strong style={{ marginLeft: "5px" }}>Contract Creation Code</Text>
                        </Row>
                        <Row style={{ marginTop: "20px" }}>
                            <TextArea value={contractCompileResult?.creationBytecode}
                                style={{ width: "100%", borderRadius: "8px", minHeight: "200px", backgroundColor: "#f9f9f9", borderColor: "#ddd", fontFamily: "SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace" }} />
                        </Row>
                    </>
                }


                {/** Contract Creation Code */}
                <Row style={{ marginTop: "50px" }}>
                    <Text type="secondary"><HolderOutlined /></Text>
                    <Text strong style={{ marginLeft: "5px" }}>Deployed Bytecode</Text>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                    <TextArea value={contractCompileResult?.deployedBytecode}
                        style={{ width: "100%", borderRadius: "8px", minHeight: "200px", backgroundColor: "#f9f9f9", borderColor: "#ddd", fontFamily: "SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace" }} />
                </Row>

                {/** Constructor Arguments */}
                {
                    contractCompileResult?.deployedArgsAbiEncode && <>
                        <Row style={{ marginTop: "50px" }}>
                            <Text type="secondary"><OneToOneOutlined /></Text>
                            <Text strong style={{ marginLeft: "5px" }}>Constructor Arguments<Text type="secondary">(ABI-Encoded and is the last bytes of the Contract Creation Code above)</Text></Text>
                        </Row>
                        <Row style={{ marginTop: "20px" }}>
                            <TextArea value={deployedArgsAbiEncodeStringView}
                                style={{ width: "100%", borderRadius: "8px", minHeight: "200px", backgroundColor: "#f9f9f9", borderColor: "#ddd", fontFamily: "SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace" }} />
                        </Row>
                    </>
                }
                {/** Deployed Bytecode Sourcemap */}
                <Row style={{ marginTop: "50px" }}>
                    <Text type="secondary"><BlockOutlined /></Text>
                    <Text strong style={{ marginLeft: "5px" }}>Deployed Bytecode Sourcemap</Text>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                    <TextArea value={contractCompileResult?.deployedBytecodeSourceMap}
                        style={{ width: "100%", borderRadius: "8px", minHeight: "200px", backgroundColor: "#f9f9f9", borderColor: "#ddd", fontFamily: "SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace" }} />
                </Row>
            </>
        }


    </>

}