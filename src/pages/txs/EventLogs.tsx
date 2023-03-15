import { Typography, Row, Col, Divider } from 'antd';
import { defaultAbiCoder } from 'ethers/lib/utils';
import NavigateLink from '../../components/NavigateLink';
import { EventLogVO } from '../../services';
import { useMethodSignature } from '../../state/application/hooks';
import { Abi_Method_Define, Abi_Method_Param } from '../../utils/decode';

const { Text } = Typography;

export default ({
    eventLogs
}: { eventLogs: EventLogVO[] | undefined }) => {

    function EventLogName(abiMethodDefine: Abi_Method_Define) {
        const {
            name, params
        } = abiMethodDefine;
        return <>
            <Text strong>{name + " ("} </Text>
            {
                params.map((param, index) => {
                    if (param.index > 0) {
                        return <Text key={index}>
                            <Text type="secondary">{`${index === 0 ? " " : ", "}index_topic_${param.index} `}</Text>
                            <Text italic>{`${param.type} `}</Text>
                            <Text strong type="danger">{`${param.name}`}</Text>
                        </Text>
                    }
                    return <Text key={index}>
                        <Text italic>{`${index === 0 ? " " : ", "}${param.type} `}</Text>
                        <Text strong type="danger">{`${param.name}`}</Text>
                    </Text>
                })
            }
            <Text strong>{" )"}</Text>
        </>
    }

    function EventLogTopic(index: number, hex: string, indexed: Abi_Method_Param[], data: Abi_Method_Param[]) {
        const abiMethodParam = index <= indexed.length ? indexed[index - 1] : data[index - 1 - indexed.length];
        const decodeResult = defaultAbiCoder.decode([abiMethodParam.type], hex);
        return <>
            <Col xl={2} xs={6}>
                <Text code>{index}</Text>
                <Text type='danger' style={{ float: "right", marginRight: "5px" }}>{abiMethodParam.name}:</Text>
            </Col>
            <Col xl={22} xs={24}>
                {
                    "address" === abiMethodParam.type ?
                        <NavigateLink path={`/address/${decodeResult.toString().toLowerCase()}`}>
                            {decodeResult.toString().toLowerCase()}
                        </NavigateLink>
                        : <Text>{decodeResult.toString().toLowerCase()}</Text>
                }
            </Col>
        </>
    }

    function EventLogData(hex: string, data: Abi_Method_Param[]) {
        const abiTypes: string[] = [];
        data.forEach(abiMetohdParam => abiTypes.push(abiMetohdParam.type))
        const decodeResult = hex != "0x" ? defaultAbiCoder.decode(abiTypes, hex) : undefined;
        return <>
            {decodeResult && decodeResult.map((result, index) => {
                return <Row key={index} style={ 
                        index === 0 ? { marginTop: "20px", paddingLeft: "20px", paddingRight: "20px" }
                            : { paddingLeft: "20px", paddingRight: "20px" }
                    }>
                    <Col xl={2} xs={24}>
                        <Text type="secondary" strong>{data[index].name}:</Text>
                    </Col>
                    <Col xl={22} xs={24}>
                        <Text>{result.toString().toLowerCase()}</Text>
                    </Col>
                </Row>
            })}
        </>
    }


    function EventLog(eventLog: EventLogVO) {
        const { address, topic0 } = eventLog;
        const abiMethodDefine = useMethodSignature(address, topic0);
        return (
            <Row key={eventLog.logIndex}>
                <Col xl={2} xs={24} style={{ marginTop: '14px' }}>
                    <Text code style={{ fontSize: "16px" }}>{eventLog.logIndex}</Text>
                </Col>
                <Col xl={20} xs={24} style={{ marginTop: '14px' }}>
                    <Row>
                        <Col xl={2} xs={24}>
                            <Text strong>Address</Text>
                        </Col>
                        <Col xl={22} xs={24}>
                            <NavigateLink path={`/address/${eventLog.address}`}>
                                {eventLog.address}
                            </NavigateLink>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={2} xs={24}>
                            <Text>Name</Text>
                        </Col>
                        <Col xl={22} xs={24}>
                            {abiMethodDefine ? EventLogName(abiMethodDefine) : eventLog.topic0}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={2} xs={24}>
                            <Text>Topics</Text>
                        </Col>
                        <Col xl={22} xs={24}>
                            {
                                JSON.parse(eventLog.topicsArr).map((val: any, index: any) => {
                                    return (<Row key={index}>
                                        {
                                            abiMethodDefine && index > 0 ? EventLogTopic(index, val, abiMethodDefine.indexed, abiMethodDefine.data)
                                                : <>
                                                    <Col xl={2} xs={24}><Text code>{index}</Text></Col>
                                                    <Col xl={22} xs={24}>
                                                        <Text>{val}</Text>
                                                    </Col>
                                                </>
                                        }

                                    </Row>)
                                })
                            }
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                        <Col xl={2} xs={24} style={{ marginTop: "20px" }}>
                            <Text italic>Data</Text>
                        </Col>
                        <Col xl={22} xs={24} style={{ backgroundColor: "#f8f9fa" , paddingBottom:"20px" }}>

                            {
                                abiMethodDefine ? EventLogData(eventLog.data, abiMethodDefine.data)
                                    :
                                    <Row style={{ marginTop: "20px", paddingLeft: "20px", paddingRight: "20px" }}>
                                        <Col xl={24}>
                                            <Text>{eventLog.data}</Text>
                                        </Col>
                                    </Row>
                            }

                        </Col>
                    </Row>
                </Col>
                <Divider style={{ margin: '18px 0px' }} />
            </Row>
        )
    }

    return <>
        {
            eventLogs && eventLogs?.map((eventLog: EventLogVO) => EventLog(eventLog))
        }
    </>

}