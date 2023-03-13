
import { Button, Col, Input, Row, Typography, Dropdown, Space, Menu } from 'antd';
import { defaultAbiCoder, Fragment, ParamType } from 'ethers/lib/utils';
import { useMemo, useState } from 'react';
import AddressTag from '../../components/AddressTag';
import type { MenuProps } from 'antd';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';

import { Abi_Method_Param } from '../../utils/decode/index.d';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

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
                result += ` ${input.baseType} ${input.name},`;
            })
            result = fragment.inputs.length > 0 ? result.substring(0, result.length - 1) + " )"
                : result + ")";
            return result;
        }
        return undefined;
    }, [raw, fragment]);

    const [showAbiDecode, setShowAbiDecode] = useState<boolean>(fragment ? true : false);
    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <Text onClick={() => setShowAbiDecode(false)}>
                            Original
                        </Text>
                    ),
                },
                {
                    key: '2',
                    label: (
                        <a onClick={() => setShowAbiDecode(true)}>
                            Abi Decode
                        </a>
                    ),
                    disabled: fragment ? false : true,
                }
            ]}
        />
    );

    const decodeResult = useMemo<{
        index: number,
        type: string,
        name: string,
        value: string
    }[]>(() => {
        const decodeResult: {
            index: number,
            type: string,
            name: string,
            value: string
        }[] = [];
        if (fragment && raw && fragment.inputs.length > 0) {
            const inputNames: string[] = [];
            const inputTypes: string[] = [];
            fragment.inputs.forEach((input: ParamType) => {
                inputNames.push(input.name)
                inputTypes.push(input.baseType);
            })
            const result = defaultAbiCoder.decode(inputTypes, "0x" + raw.substring(10));
            for (var i = 0; i < result.length; i++) {
                decodeResult.push({
                    index: i,
                    type: inputTypes[i],
                    name: inputNames[i],
                    value: result[i].toString()
                })
            }
        }
        return decodeResult;
    }, [raw, fragment])

    return (<>
        {
            showAbiDecode ? <>

                <div style={{
                    "backgroundColor": "#f8f9fa",
                    "minHeight": "200px",
                    "padding": "2%"
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
                            <Text strong>MethodId</Text>
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
                                        type === "address" ? <AddressTag address={value} sub={0}></AddressTag>
                                            : <Text>{value}</Text>
                                    }
                                </Col>
                            </Row>)
                        })
                    }
                </div>

            </>
                : <TextArea style={{ cursor: "default", color: "black" }} rows={4} disabled
                    value={raw} />
        }

        <Dropdown overlay={menu}>
            <Button style={{marginTop:"10px"}}>
                <Space>
                    View Input As
                    <DownOutlined />
                </Space>
            </Button>
        </Dropdown>


    </>)
}