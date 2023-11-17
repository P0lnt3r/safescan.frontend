import { Button, Card, Col, Row, Typography } from "antd"
import {
    StopOutlined,
    InfoCircleOutlined,
    DoubleRightOutlined
} from '@ant-design/icons';
import { useMemo } from "react";

const { Text, Link } = Typography;

export default ({ verifyParams, verifyResult }: {
    verifyParams: {
        contractAddress: string | null,
        compileVersion: string | null,
        optimizerEnabled: boolean,
        optimizerRuns: string,
        contractSourceCode: string | undefined,
        license: string | undefined,
        evmVersion: string | undefined
    },
    verifyResult?: {
        output ?: any,
        result ?: any
    }
}) => {

    const {
        compileVersion,
        optimizerEnabled,
        optimizerRuns,
        evmVersion
    } = verifyParams;

    const errors = verifyResult?.output?.errors;
    const contracts = verifyResult?.output?.contracts?.["contract.sol"];

    const { contractNames, contractNamesStr, contractBytecodes } = useMemo(() => {
        if (contracts) {
            let contractNames: string[] = [];
            for (let name in contracts) {
                contractNames.push(name)
            }
            contractNames = contractNames.reverse()
            let contractNamesStr = "";
            for (let i = 0; i < contractNames.length; i++) {
                if (i == contractNames.length - 1) {
                    contractNamesStr += `${contractNames[i]}`;
                } else {
                    contractNamesStr += `${contractNames[i]}, `;
                }
            }
            let contractBytecodes: {
                contractName: string,
                bytecode: string
            }[] = [];
            contractNames.filter((contractName: string) =>
                contracts[contractName].evm && contracts[contractName].evm.bytecode && contracts[contractName].evm.bytecode.object
            ).forEach((contractName) => {
                contractBytecodes.push({
                    contractName,
                    bytecode: contracts[contractName].evm.bytecode.object
                });
            })
            return {
                contractNames,
                contractNamesStr,
                contractBytecodes
            }
        }
        return {
            contractNames: undefined,
            contractNamesStr: undefined,
            contractBytecodes: undefined
        };
    }, [contracts]);

    return <>

        <Card>
            <Row>
                <Col span={24}>
                    <Text style={{ fontSize: "16px" }} strong>Compiler debug log:</Text>
                    <br />
                    <Text style={{ fontWeight: 500 }} type="danger">
                        <StopOutlined style={{ marginRight: "5px" }} />
                        Error! Unable to generate Contract Bytecode and ABI
                        {
                            !contractBytecodes && <Text style={{ fontWeight: "bold", marginLeft: "2px" }} type="danger">
                                (General Exception, unable to get compiled [bytecode])
                            </Text>
                        }
                    </Text>
                    <br />
                    {
                        contractBytecodes && <>
                            <Text>
                                <DoubleRightOutlined style={{ marginRight: "5px" }} />
                                Found the following ContractName(s) in source code :
                                <Text strong>{contractNamesStr}</Text>
                            </Text>
                            <br />
                        </>

                    }
                    <Text style={{ fontWeight: 500 }}>
                        <InfoCircleOutlined style={{ marginRight: "5px" }} />
                        For troubleshooting, you can try compiling your source code with the
                        <Link strong style={{ marginLeft: "2px", marginRight: "2px" }} >
                            <a href="https://remix.ethereum.org/" target="#href">Remix - Solidity IDE</a>
                        </Link>
                        and check for exceptions
                    </Text>
                </Col>
            </Row>

            <Row style={{ marginTop: "20px" }}>

                <Col span={24}>

                    {
                        errors && <>
                            <Text style={{ fontSize: "16px" }} strong>Compiler Warning(s):</Text>
                            <div style={{
                                marginTop: "20px", width: "100%", backgroundColor: "#f7f7f7",
                                border: "1px solid #dddada", padding: "16px 16px", borderRadius: ".5rem",
                                whiteSpace: "pre-wrap", wordWrap: "break-word",
                                fontFamily: "SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace"
                            }}>
                                {
                                    errors && errors.map((error: any) => {
                                        const { severity, component, formattedMessage, sourceLocation, message, type } = error;
                                        return <>{
                                            formattedMessage
                                        }</>
                                    })
                                }
                            </div>
                        </>
                    }

                    <div style={{
                        marginTop: "20px", width: "100%", backgroundColor: "#f7f7f7",
                        border: "1px solid #dddada", padding: "16px 16px", borderRadius: ".5rem"
                    }}>
                        <Text strong>Compiler Version: </Text><Text>{compileVersion}</Text>
                        <br />
                        <Text strong>EVM Version: </Text><Text>{evmVersion}</Text>
                        <br />
                        <Text strong>Optimization Enabled: </Text><Text>{optimizerEnabled ? "True" : "False"}</Text>
                        <br />
                        <Text strong>Runs: </Text><Text>{optimizerRuns}</Text>

                        <div style={{
                            width: "100%", backgroundColor: "#f7f7f7", margin: "30px auto",
                            border: "1px solid #dddada", whiteSpace: "nowrap",
                            overflowX: "auto",
                            padding: "24px 20px", borderRadius: ".5rem",
                            fontFamily: "SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace"
                        }}>

                            <Text strong>Bytecode (what we are looking for):</Text>
                            <br />
                            60566023600b82828239805160001a607314601657fe5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212200a87d9c01d4217a023a66c7db769114c00cab434f3f083df197b609ebf981f9d64736f6c63430006060033

                        </div>

                        {
                            contractBytecodes && <>
                                <Text strong>
                                    - vs what we got -
                                </Text>
                                <div style={{
                                    width: "100%", backgroundColor: "#f7f7f7", margin: "30px auto",
                                    border: "1px solid #dddada", whiteSpace: "nowrap",
                                    overflowX: "auto",
                                    padding: "24px 20px", borderRadius: ".5rem",
                                    fontFamily: "SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace"
                                }}>
                                    <Text>We tried looking for a match from the list of compiled contract bytecode outputs (as listed below), but was unable to find an exact match.</Text>
                                    <br /><br />
                                    {
                                        contractBytecodes && contractBytecodes.map((contractNameBytecode) => {
                                            const { contractName, bytecode } = contractNameBytecode;
                                            return <div key={contractName}>
                                                <br />
                                                <Text strong>{`${contractBytecodes.indexOf(contractNameBytecode) + 1}) ${contractName}`}</Text>
                                                <br />
                                                {bytecode}
                                                <br />
                                            </div>
                                        })
                                    }
                                </div>
                            </>
                        }

                    </div>
                </Col>
            </Row>

            <Button type="primary" size="large" style={{
                marginTop: "2em",
                borderRadius: "4px"
            }}>
                Start Over
            </Button>

        </Card>

    </>

}