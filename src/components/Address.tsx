import { AddressPropVO } from "../services"
import { Button, Col, Row, Card, Space, Typography, Avatar, List, Tooltip } from 'antd';
import { Link as RouterLink } from 'react-router-dom';
import { useMemo } from "react";

import {
    FileTextOutlined,       // 合约
    FileProtectOutlined,    // 系统合约
    ApartmentOutlined,      // 主节点
    ClusterOutlined,        // 超级节点
} from '@ant-design/icons';

const { Text, Link } = Typography;

export default ({ address, propVO, style }: {
    address: string,
    propVO?: AddressPropVO | undefined,
    style?: {
        hasLink: boolean
    }
}) => {
    const { type, subType, tag, prop, remark } = useMemo(() => {
        if (propVO) {
            return propVO;
        }
        return {
            type: undefined,
            subType: undefined,
            tag: undefined,
            prop: undefined,
            remark: undefined,
        }
    }, [address, propVO]);

    const RenderIcon = () => {
        const isSuperNode = subType == "supernode";
        if (isSuperNode) {
            return <Tooltip title="SuperNode"><ClusterOutlined style={{ marginRight: "3px" }} /></Tooltip>;
        }
        const isMasterNode = subType == "masternode";
        if (isMasterNode) {
            return <Tooltip title="MasterNode"><ApartmentOutlined style={{ marginRight: "3px" }} /></Tooltip>;
        }
        const isContract = type == "contract";
        const isSystemContract = isContract && subType == "system";
        if (isSystemContract) {
            return <Tooltip title="System Contract"><FileProtectOutlined style={{ marginRight: "3px", color: "green" }} /></Tooltip>;
        }
        if (isContract) {
            return <Tooltip title="Contract"><FileTextOutlined style={{ marginRight: "3px" }} /></Tooltip>;
        }
        return <>
        </>
    }

    return <>
        <Text>
            {RenderIcon()}
            <Tooltip title={address}>
                {
                    (style && !style.hasLink) && <>
                        {
                            tag && <Text ellipsis style={{maxWidth:"90%"}}>
                                {tag}
                            </Text>
                        }
                        {
                            !tag && <Text ellipsis style={{maxWidth:"90%"}}>
                                {address}
                            </Text>
                        }
                    </>
                }
                {
                    (!style || style.hasLink == true) && <>
                        <RouterLink to={`/address/${address}`}>
                            {
                                tag && <Link ellipsis style={{maxWidth:"90%"}}>
                                    {tag}
                                </Link>
                            }
                            {
                                !tag && <Link ellipsis style={{maxWidth:"90%"}}>
                                    {address}
                                </Link>
                            }
                        </RouterLink>
                    </>
                }
            </Tooltip>
        </Text>
    </>

}