import { Typography, Tag, Tooltip, Row, Col, Divider } from 'antd';
import { AddressPropVO, NodeRewardVO } from "../../services"
import {
    QuestionCircleOutlined,
    ArrowRightOutlined,
} from '@ant-design/icons';
import shape from '../../images/shape-1.svg'
import { useMemo } from 'react';
import Address from '../../components/Address';
import EtherAmount from '../../components/EtherAmount';
const { Text } = Typography;

export default ({ nodeRewards }: { nodeRewards: NodeRewardVO[] }) => {

    const { superNode, masterNode } = useMemo<{
        superNode?: { address: string, propVO: AddressPropVO },
        masterNode?: { address: string, propVO: AddressPropVO },
    }>(() => {
        let superNode, masterNode;
        if (nodeRewards) {
            nodeRewards.forEach(nodeReward => {
                if (nodeReward.nodeType == 1) {
                    superNode = {
                        address: nodeReward.nodeAddress,
                        propVO: nodeReward.nodeAddressPropVO
                    }
                } else if (nodeReward.nodeType == 2) {
                    masterNode = {
                        address: nodeReward.nodeAddress,
                        propVO: nodeReward?.nodeAddressPropVO
                    }
                }
            })
        }
        return {
            superNode, masterNode
        }
    }, [nodeRewards]);

    const RewardTypeLabel = (rewardType: number) => {
        switch (rewardType) {
            case 1:
                return "Creator";
            case 2:
                return "Founder";
            case 3:
                return "Voter";
        }
    }
    const RenderNodeReward = (nodeReward: NodeRewardVO) => {
        const { address, addressPropVO, rewardType, amount, eventLogIndex } = nodeReward;
        const rewardTypeLabel = RewardTypeLabel(rewardType);
        return <>
            <Row key={eventLogIndex}>
                <Col style={{ minWidth: "220px" , lineHeight:"24px" }}>
                    <img src={shape} style={{ width: "8px", marginTop: "-8px", marginRight: "4px" }} />
                    <EtherAmount raw={amount} fix={18} />
                </Col>
                <Col xl={16} xs={24}>
                    <Text><ArrowRightOutlined style={{ marginLeft: "15px", marginRight: "10px" }} />
                        <Text style={{ marginRight: "5px" }} type="secondary" >[{rewardTypeLabel}]:</Text>
                        <Address address={address} propVO={addressPropVO} />
                    </Text>
                </Col>
            </Row>
        </>
    }

    return <>
        <Divider style={{ margin: '18px 0px' }} />
        <Row>
            <Col xl={8} xs={24}>
                <Tooltip title="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>Node Rewards:  <Tag color="#77838f">{nodeRewards.length}</Tag></Text>
            </Col>
            <Col xl={16} xs={24}>
                <Row style={{ marginTop: "2px" }}>
                    <Text strong style={{ marginRight: "5px" }}>Supernode:</Text>
                    {
                        superNode && superNode.propVO &&
                        <Address address={superNode.address} propVO={superNode.propVO} />
                    }
                </Row>
                {
                    nodeRewards.filter(nodeReward => nodeReward.nodeType == 1)
                        .map(nodeReward => RenderNodeReward(nodeReward))
                }
                <Row style={{ marginTop: "20px" }}>
                    <Text strong style={{ marginRight: "5px" }}>Masternode:</Text>
                    {
                        masterNode && masterNode.propVO &&
                        <Address address={masterNode.address} propVO={masterNode.propVO} />
                    }
                </Row>
                {
                    nodeRewards.filter(nodeReward => nodeReward.nodeType == 2)
                        .map(nodeReward => RenderNodeReward(nodeReward))
                }
            </Col>
        </Row>
    </>

}