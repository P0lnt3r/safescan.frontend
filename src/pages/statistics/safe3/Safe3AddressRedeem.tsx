import { Typography, Row, Col, Divider, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { fetchAddressSafe3Redeem } from '../../../services/safe3Redeem';
import { Safe3AddressRedeemVO } from '../../../services';

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
                safe3AddressRedeemVO && <Row>
                    <Divider />
                    <Col span={24}>
                        <Text strong type="secondary">Safe3 Address</Text><br />
                        <Text strong>{safe3AddressRedeemVO.safe3Address}</Text>
                    </Col>
                    <Col span={24}>
                        <Text strong type="secondary">Avaliable Amount</Text><br />
                        <Text>{ safe3AddressRedeemVO.available } SAFE</Text>
                        <Divider type="vertical"></Divider>
                        <Text>{ safe3AddressRedeemVO.availableRedeemHash }</Text>
                    </Col>
                    <Col span={24}>
                        <Text strong type="secondary">Locked Amount</Text><br />
                        <Text>{ safe3AddressRedeemVO.locked } SAFE</Text>
                        <Divider type="vertical"></Divider>
                        <Text>{ safe3AddressRedeemVO.lockedRedeemHash }</Text>
                    </Col>
                    <Col span={24}>
                        <Text strong type="secondary">Masternode</Text><br />
                        <Text>{ safe3AddressRedeemVO.mLockedAmount } SAFE</Text>
                        <Divider type="vertical"></Divider>
                        <Text>{ safe3AddressRedeemVO.masternodeRedeemHash }</Text>
                    </Col>
                    <Col span={24}>
                        <Text strong type="secondary">Safe4 Address</Text><br />
                        <Text strong>{safe3AddressRedeemVO.safe4Address}</Text>
                    </Col>
                    <Divider />
                </Row>
            }

        </Spin>
    </>

}