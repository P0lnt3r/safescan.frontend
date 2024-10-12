import { Typography, Row, Col, Divider, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressSafe3Redeem } from '../../../services/safe3Redeem';
import { Safe3AddressRedeemVO } from '../../../services';
import EtherAmount from '../../../components/EtherAmount';

const { Text } = Typography

export default ({
    address
}: {
    address: string
}) => {
    const [safe3AddressRedeemVO, setSafe3AddressRedeemVO] = useState<Safe3AddressRedeemVO>();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        setLoading(true)
        fetchAddressSafe3Redeem(address).then((data: Safe3AddressRedeemVO) => {
            setSafe3AddressRedeemVO(data);
            setLoading(false);
        })
    }, [address]);
    return <>
        <Spin spinning={loading}>
            {
                safe3AddressRedeemVO?.safe3Address && <Row>
                    <Divider />
                    <Col span={24}>
                        <Text strong type="secondary">Safe3 Address</Text><br />
                        <Text strong>{safe3AddressRedeemVO.safe3Address}</Text>
                    </Col>
                    <Col span={24} style={{ marginTop: "5px" }}>
                        <Text strong type="secondary">Avaliable Amount</Text><br />
                        <Text strong>{safe3AddressRedeemVO.available} SAFE</Text>
                    </Col>
                    <Col span={24}>
                        <Text strong type="secondary">Locked Amount</Text><br />
                        <Text strong>{safe3AddressRedeemVO.locked} SAFE</Text>
                    </Col>
                    {
                        safe3AddressRedeemVO.mLockedAmount != '0' &&
                        <Col span={24}>
                            <Text strong type="secondary">Masternode</Text><br />
                            <Text strong>{safe3AddressRedeemVO.mLockedAmount} SAFE</Text>
                        </Col>
                    }
                    <Divider />
                </Row>
            }
            {
                safe3AddressRedeemVO?.safe4Address && <Row>
                    <Divider />
                    <Col span={24}>
                        <Text strong type="secondary">Safe4 Address</Text><br />
                        <Text strong>{safe3AddressRedeemVO.safe4Address}</Text>
                    </Col>
                    <Col span={24} style={{ marginTop: "5px" }}>
                        <Text strong type="secondary">Avaliable Amount Received</Text><br />
                        {
                            safe3AddressRedeemVO.totalAvailableAmount && <>
                                <Text strong><EtherAmount raw={safe3AddressRedeemVO.totalAvailableAmount} /></Text>
                            </>
                        }
                    </Col>
                    <Col span={24}>
                        <Text strong type="secondary">Locked Amount Received</Text><br />
                        {
                            safe3AddressRedeemVO.totalLockedAmount && <>
                                <Text strong><EtherAmount raw={safe3AddressRedeemVO.totalLockedAmount} /></Text>
                            </>
                        }
                    </Col>
                    {
                        safe3AddressRedeemVO.totalMasternodeCount && safe3AddressRedeemVO.totalMasternodeCount > 0 &&
                        <Col span={24}>
                            <Text strong type="secondary">Masternode Received</Text><br />
                            {
                                safe3AddressRedeemVO.totalMasternode && <>
                                    <Text strong>
                                        <EtherAmount raw={safe3AddressRedeemVO.totalMasternode} />
                                        <Divider type='vertical' />
                                        ({safe3AddressRedeemVO.totalMasternodeCount})
                                    </Text>
                                </>
                            }
                        </Col>
                    }
                    <Divider />
                </Row>
            }

        </Spin>
    </>

}