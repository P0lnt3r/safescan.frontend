
import { Button, Col, Input, Row, Typography, Dropdown, Space, Menu } from 'antd';
import { defaultAbiCoder, Fragment, ParamType, Interface, FunctionFragment } from 'ethers/lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AddressTag from '../../components/AddressTag';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import Address from '../../components/Address';
import { ethers } from 'ethers';


const { TextArea } = Input;
const { Title, Text, Paragraph, Link } = Typography;

const enum ShowMode {
    Raw = "raw",
    ABI = "abi",
    UTF8 = "utf8"
}

export default ({ raw, methodId, fragment }: {
    raw: string
    methodId: string
    fragment?: Fragment
}) => {

    const functionSignature = useMemo(() => {
        if (fragment) {
            const functionName = fragment.name;
            let result: string = functionName + "(";
            fragment.inputs.forEach((input: ParamType) => {
                result += ` ${input.type} ${input.name},`;
            })
            result = fragment.inputs.length > 0 ? result.substring(0, result.length - 1) + " )"
                : result + ")";
            return result;
        }
        return undefined;
    }, [raw, fragment]);

    const [showMode, setShowMode] = useState<ShowMode>(
        fragment ? ShowMode.ABI : ShowMode.Raw
    );

    const menu = (
        <Menu
            items={[
                {
                    key: ShowMode.Raw,
                    label: (
                        <Text onClick={() => setShowMode(ShowMode.Raw)}>
                            Original Data
                        </Text>
                    ),
                },
                {
                    key: ShowMode.ABI,
                    label: (
                        <a onClick={() => setShowMode(ShowMode.ABI)}>
                            Abi Decode
                        </a>
                    ),
                    disabled: fragment ? false : true,
                },
                {
                    key: ShowMode.UTF8,
                    label: (
                        <a onClick={() => setShowMode(ShowMode.UTF8)}>
                            UTF-8 Decode
                        </a>
                    )
                }
            ]}
        />
    );
    const decodeResult = useMemo<{
        index: number,
        type: string,
        name: string,
        value: any
    }[]>(() => {
        const decodeResult: {
            index: number,
            type: string,
            name: string,
            value: any
        }[] = [];
        if (fragment && raw && fragment.inputs.length > 0) {
            const inputNames: string[] = [];
            const inputTypes: string[] = [];
            fragment.inputs.forEach((input: ParamType) => {
                inputNames.push(input.name)
                inputTypes.push(input.baseType);
            })
            const result = new Interface([fragment.format("full")])
                .decodeFunctionData(fragment as FunctionFragment, raw);
            for (var i = 0; i < result.length; i++) {
                decodeResult.push({
                    index: i,
                    type: inputTypes[i],
                    name: inputNames[i],
                    value: result[i]
                })
            }
        }
        return decodeResult;
    }, [raw, fragment])

    const RenderInputParamValues = (values: any[]) => {

    }

    const RenderInput = useCallback(() => {
        switch (showMode) {
            case ShowMode.ABI:
                return <>
                    <div style={{
                        "backgroundColor": "#f8f9fa",
                        "minHeight": "200px",
                        "padding": "2%",
                    }}>
                        <Row>
                            <Col xl={4} xs={24}>
                                <Text strong>Function</Text>
                            </Col>
                            <Col xl={20} xs={24}>
                                <Text>{functionSignature}</Text>
                            </Col>
                        </Row>
                        <Row style={{ "marginTop": "20px" }}>
                            <Col xl={4} xs={24}>
                                <Text strong>Method ID</Text>
                            </Col>
                            <Col xl={20} xs={24}>
                                <Text>{methodId}</Text>
                            </Col>
                        </Row>
                        <Row style={{ "marginTop": "20px" }}>
                            <Col xl={4} xs={24}>
                                <Text strong>Input</Text>
                            </Col>
                        </Row>
                        {
                            decodeResult && decodeResult.map(({ index, type, name, value }) => {
                                return (<Row key={index}>
                                    <Col xl={4}>
                                        <Text code>{index}</Text>
                                        <Text strong style={{ "float": "right", "paddingRight": "5px" }}>{name}:</Text>
                                    </Col>
                                    <Col xl={20} xs={24}>
                                        {
                                            type != "array" ?
                                                type == "address" ? <Address address={value.toString().toLowerCase()} ></Address>
                                                    : <Text>{value.toString()}</Text>
                                                : <>
                                                    <Text>  {value.toString()}</Text>
                                                    {/* {
                                                    value.map((ele: any, index: number) => {
                                                        return <Row key={index}>
                                                            {
                                                                <Address address={value.toString().toLowerCase()} ></Address>
                                                            }
                                                        </Row>
                                                    })
                                                } */}
                                                </>
                                        }
                                    </Col>
                                </Row>)
                            })
                        }
                    </div>
                </>
            case ShowMode.UTF8:
                const decodeData = ethers.utils.toUtf8String(raw);
                return <>
                    <TextArea style={{ cursor: "default", color: "black" }} rows={4} disabled
                        value={decodeData} />
                </>
            default:
                return <>
                    <TextArea style={{ cursor: "default", color: "black" }} rows={4} disabled
                        value={raw} />
                </>
        }
    }, [showMode])

    return (<>
        {
            RenderInput()
        }
        <Dropdown overlay={menu}>
            <Button style={{ marginTop: "10px" }}>
                <Space>
                    View Input As
                    <DownOutlined />
                </Space>
            </Button>
        </Dropdown>
    </>)
}