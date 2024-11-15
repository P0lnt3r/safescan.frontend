import { SafeAccountManagerActionVO } from "../../services"
import { Typography, Tag, Tooltip, Row, Col, Divider } from 'antd';
import { AddressPropVO, NodeRewardVO } from "../../services"
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
    FrownOutlined,
    CaretRightOutlined,
    ArrowRightOutlined,
    LockOutlined,
    UnlockOutlined,
    ExportOutlined,
    ImportOutlined,
    MedicineBoxOutlined,
    UserSwitchOutlined,
    HourglassTwoTone,
    CarryOutTwoTone,
    SyncOutlined,
    ApartmentOutlined,
    UserOutlined,
    SolutionOutlined,
    DeliveredProcedureOutlined,
    ContainerOutlined,
    InboxOutlined,
    ClockCircleOutlined,
    RetweetOutlined,
    LoginOutlined
} from '@ant-design/icons';
import shape from '../../images/shape-1.svg'
import { useMemo } from 'react';
import Address from '../../components/Address';
import EtherAmount from '../../components/EtherAmount';
import { isMobile } from "react-device-detect";
const { Text } = Typography;

export default ({ safeAccountManagerActions }: { safeAccountManagerActions: SafeAccountManagerActionVO[] }) => {

    const RenderSafeAccountManagerAction = (safeAccountManagerAction: SafeAccountManagerActionVO) => {
        const { lockId, action, amount, to, lockDay } = safeAccountManagerAction;
        const lockIds = JSON.parse(lockId);
        const isDeposit = action == "SafeDeposit";
        const isWithdraw = action == "SafeWithdraw";
        const isTransfer = action == "SafeTransfer";
        const isAddLock = action == "SafeAddLockDay";
        const isFreeze = action == "SafeFreeze";
        const isVote = action == "SafeVote";
        const isMoveID0 = action == "SafeMoveID0";
        const OutputActionAndLabel = () => {
            if (isDeposit) {
                return <>
                    <LockOutlined />
                    <Text type='secondary'> [Deposit]</Text>
                </>;
            }
            if (isWithdraw) {
                return <>
                    <RetweetOutlined />
                    <Text type='secondary'> [Withdraw]</Text>
                </>;
            }
            if (isAddLock) {
                return <>
                    <ClockCircleOutlined />
                    <Text type='secondary'> [AddLockDay]</Text>
                </>;
            }
            if (isFreeze) {
                return <>
                    <HourglassTwoTone />
                    <Text type='secondary'> [Freeze]</Text>
                </>;
            }
            if (isVote) {
                return <>
                    <ContainerOutlined />
                    <Text type='secondary'> [Vote]</Text>
                </>
            }
            if (isMoveID0) {
                return <>
                    <SyncOutlined />
                    <Text type='secondary'> [MoveID0]</Text>
                </>
            }
            return <>
                <SyncOutlined />
                <Text type='secondary'> [Transfer]</Text>
            </>;
        }
        return <Row>
            {!isMobile && <>
                <Row style={{ width: "60%" }}>
                    <Col span={3}>
                        {OutputActionAndLabel()}
                    </Col>
                    <Col span={19}>
                        <Text style={{ marginLeft: "5px", marginRight: "5px" }}>
                            <EtherAmount raw={amount} fix={18} />
                        </Text>
                        {
                            isFreeze && <LoginOutlined style={{ marginLeft: "5px", marginRight: "5px" }} />
                        }
                        {
                            !isFreeze && <ArrowRightOutlined style={{ marginLeft: "5px", marginRight: "5px" }} />
                        }
                        <Address address={to} />
                    </Col>
                </Row>
            </>}
            {isMobile && <>
                <Col span={24}>
                    {
                        <>
                            {OutputActionAndLabel()}
                            <span style={{ marginLeft: "2%" }}></span>
                            <EtherAmount raw={amount} fix={18}></EtherAmount>
                        </>
                    }
                </Col>
                <Col span={24}>
                    {
                        isFreeze &&
                        <LoginOutlined style={{ marginLeft: "5px", marginRight: "5px" }} />
                    }
                    {
                        !isFreeze &&
                        <ArrowRightOutlined style={{ marginLeft: "5px", marginRight: "5px" }} />
                    }
                    <Address address={to} />
                </Col>
            </>}
            {
                (lockIds instanceof Array) &&
                lockIds.map(lockId => {
                    return <>
                        {
                            lockId != '0' &&
                            <Col span={24}>
                                <img src={shape} style={{ width: "8px", marginTop: "-2px", marginRight: "4px" }} />
                                <UnlockOutlined />
                                <Text type='secondary' strong delete>[ID:{lockId}]</Text>
                            </Col>
                        }
                    </>
                })
            }
            {
                lockId != "0" && !(lockIds instanceof Array) &&
                <Col span={24}>
                    <img src={shape} style={{ width: "8px", marginTop: "-8px", marginRight: "4px", marginLeft: "6px" }} />
                    <Text type='secondary' strong>[ID:{lockId}]</Text>
                    <Text>
                        {
                            lockDay > 0 &&
                            <>
                                (
                                {
                                    (isDeposit || isTransfer) && <LockOutlined />
                                }
                                {
                                    (isFreeze || isVote) && <HourglassTwoTone />
                                }
                                {lockDay} Days)
                            </>
                        }
                    </Text>
                </Col>
            }
        </Row>
    }

    return <>

        <Divider style={{ margin: '18px 0px' }} />
        <Row id="safeAccountManagerActions">
            <Col xl={8} xs={24}>
                <Tooltip title="" color='black'>
                    <QuestionCircleOutlined />
                </Tooltip>
                <Text strong style={{ marginLeft: "5px" }}>AccountManager Actions</Text>
            </Col>
            <Col xl={16} xs={24}>
                {safeAccountManagerActions.map(RenderSafeAccountManagerAction)}
            </Col>
        </Row>

    </>

}