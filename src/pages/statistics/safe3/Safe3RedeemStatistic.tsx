import { Card, Col, Divider, Row, Statistic, Typography } from "antd"
import { 
    ApartmentOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from "react";
import { fetchSafe3RedeemStatistic } from "../../../services/safe3Redeem";
import { Safe3RedeemStatisticVO } from "../../../services";
import { CurrencyAmount } from "@uniswap/sdk";

const { Text } = Typography

export default () => {

    useEffect( () => {
        fetchSafe3RedeemStatistic().then( data => {
            setSafe3RedeemStatistic(data)
        })
    } , [] );

    const [ safe3RedeemStatistic , setSafe3RedeemStatistic ] = useState<Safe3RedeemStatisticVO>();

    const { 
        totalSafe3Amount , redeemSafe3Amount , leftSafe3Amount , leftRate , 
        totalMasternodeCount , redeemMasternodeCount , leftMasternodeCount , leftMRate ,
    } = useMemo( () => {
        if ( safe3RedeemStatistic ){
            const { totalSafe3Amount , redeemSafe3Amount , totalMasternodeCount , redeemMasternodeCount } = safe3RedeemStatistic; 
            const leftSafe3Amount = CurrencyAmount.ether(totalSafe3Amount).subtract(CurrencyAmount.ether(redeemSafe3Amount));
            const leftRate = Number(leftSafe3Amount.divide(CurrencyAmount.ether(totalSafe3Amount)).toFixed(4)) * 100;
            const leftMRate = (Number( (totalMasternodeCount - redeemMasternodeCount) / totalMasternodeCount ) * 100).toFixed(2);
            return {
                totalSafe3Amount : CurrencyAmount.ether(totalSafe3Amount).toFixed(2),
                redeemSafe3Amount : CurrencyAmount.ether(redeemSafe3Amount).toFixed(2),
                leftSafe3Amount : leftSafe3Amount.toFixed(2),
                leftRate,
                totalMasternodeCount,
                redeemMasternodeCount,
                leftMasternodeCount : totalMasternodeCount - redeemMasternodeCount , 
                leftMRate
            }
        }else{
            return {
                totalSafe3Amount : "0",
                redeemSafe3Amount : "0",
                leftSafe3Amount : "0",
                leftRate : "0",
                totalMasternodeCount : 0,
                redeemMasternodeCount : 0,
                leftMasternodeCount : 0
            }
        }
    } , [safe3RedeemStatistic]);

    return <>

        <Card title="Safe3 Network Asset Statistics">
            <Row>
                <Col xl={6} xs={24} style={{ padding: "1%" }}>
                    <Statistic title="Safe3 Total SAFE Amount" value={totalSafe3Amount} />
                    <Divider />
                    <Statistic title="Safe3 Masternodes" value={ safe3RedeemStatistic?.totalMasternodeCount } />
                    <Col xl={0} xs={24}>
                        <Divider />
                    </Col>
                </Col>
                <Col xl={8} xs={24} style={{ padding: "1%" }}>
                    <Row>
                        <Col span={12}>
                            <Statistic title="已迁移" value={redeemSafe3Amount}/>
                        </Col>
                        <Col span={12}>
                            <Statistic style={{ float: "right" }} valueStyle={{ float: "right" }} title={
                                <Text style={{ float: "right" }} type="secondary">未迁移({leftRate}%)</Text>}
                                value={leftSafe3Amount}
                            />
                        </Col>
                    </Row>
                    <Divider />
                    <Row>
                        <Col span={12}>
                            <Statistic title="已迁移" value={redeemMasternodeCount} prefix={<ApartmentOutlined />} />
                        </Col>
                        <Col span={12}>
                            <Statistic style={{ float: "right" }} valueStyle={{ float: "right" }} title={
                                <Text style={{ float: "right" }} type="secondary">未迁移({leftMRate}%)</Text>}
                                value={leftMasternodeCount}
                            />
                        </Col>
                    </Row>
                    <Col xl={0} xs={24}>
                        <Divider />
                    </Col>
                </Col>
            </Row>
        </Card>

    </>
}