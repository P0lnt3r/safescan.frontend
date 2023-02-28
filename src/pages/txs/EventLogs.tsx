import { Typography, Row, Col, Divider } from 'antd';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { EventLogVO } from '../../services';
import { useMethodSignature } from '../../state/application/hooks';
import { Abi_Method_Define, Abi_Method_Param } from '../../utils/decode';

const { Text, Link } = Typography;

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
                        return <>
                            <Text type="secondary">{`${index == 0 ? " " : ", "}index_topic_${param.index} `}</Text>
                            <Text italic>{`${param.type} `}</Text>
                            <Text strong type="danger">{`${param.name}`}</Text>
                        </>
                    }
                    return <>
                        <Text italic>{`${index == 0 ? " " : ", "}${param.type} `}</Text>
                        <Text strong type="danger">{`${param.name}`}</Text>
                    </>
                })
            }
            <Text strong>{" )"}</Text>
        </>
    }

    function EventLogTopic(index: number, hex: string, indexed: Abi_Method_Param[]) {
        const abiMethodParam = indexed[index - 1];
        const decodeResult = defaultAbiCoder.decode([abiMethodParam.type], hex);
        return <>
            <Col xl={2} xs={6}>
                <Text code>{index}</Text>
                <Text type='danger' style={{ float: "right", marginRight: "5px" }}>{abiMethodParam.name}:</Text>
            </Col>
            <Col xl={22} xs={24}>
                {
                    "address" === abiMethodParam.type ?
                        <Link href={`/address/${decodeResult.toString().toLowerCase()}`}>
                            {decodeResult.toString().toLowerCase()}
                        </Link>
                        : <Text>{decodeResult.toString().toLowerCase()}</Text>
                }
            </Col>
        </>
    }

    function EventLogData(hex: string, data: Abi_Method_Param[]) {
        const abiTypes: string[] = [];
        data.forEach(abiMetohdParam => abiTypes.push(abiMetohdParam.type))
        const decodeResult = defaultAbiCoder.decode(abiTypes, hex);
        return <>
            {decodeResult.map((result, index) => {
                return <>
                    <Col xl={2} xs={24}>
                        <Text type="secondary" strong>{data[index].name}:</Text>
                    </Col>
                    <Col xl={22} xs={24}>
                        <Text>{result.toString().toLowerCase()}</Text>
                    </Col>
                </>
            })}
        </>
    }


    function EventLog(eventLog: EventLogVO) {
        const topic = eventLog.topic0;
        const abiMethodDefine = useMethodSignature(topic);
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
                            <Link href={`/address/${eventLog.address}`}>
                                {eventLog.address}
                            </Link>
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
                                            abiMethodDefine && index > 0 ? EventLogTopic(index, val, abiMethodDefine.indexed)
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
                        <Col xl={22} xs={24} style={{ backgroundColor: "#f8f9fa" }}>
                            <Row style={{ marginTop: "20px", marginBottom: "20px", paddingLeft: "20px", paddingRight: "20px" }}>
                                {
                                    abiMethodDefine ? EventLogData(eventLog.data, abiMethodDefine.data)
                                        : <>
                                            <Col xl={24}>
                                                {eventLog.data}
                                            </Col>
                                        </>
                                }
                            </Row>
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