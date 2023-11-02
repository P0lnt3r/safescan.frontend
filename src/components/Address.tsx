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
import { useAddressProp } from "../state/application/hooks";
import { useDispatch } from "react-redux";
import { Application_Update_AddressPropMap } from "../state/application/action";
import { utils } from 'ethers';
const { Text, Link, Paragraph } = Typography;

export function ChecksumAddress(address: string): string {
    try {
        return address ? utils.getAddress(address) : ""
    } catch (error) {
        return address;
    }
}

export default ({ address, propVO, style, to }: {
    address: string,
    propVO?: AddressPropVO | undefined,
    to?: string,
    style?: {
        hasLink?: boolean,
        forceTag?: boolean,
        noTip?: boolean,
        color?: string,
        ellipsis?: boolean
    }
}) => {
    const _propVO = useAddressProp(address);
    const dispatch = useDispatch();
    const { type, subType, tag, prop, remark } = useMemo(() => {
        if (propVO) {
            if (_propVO == undefined) {
                dispatch(Application_Update_AddressPropMap([propVO]));
            }
            return propVO;
        }
        if (_propVO != undefined) {
            return _propVO;
        }
        return {
            type: undefined,
            subType: undefined,
            tag: undefined,
            prop: undefined,
            remark: undefined,
        }
    }, [address, propVO]);

    const checksumAddress = ChecksumAddress(address);
    const ellipsisAddress = (style && style.ellipsis == false) ?
        checksumAddress
        : checksumAddress.substring(0, 8) + "..." + checksumAddress.substring(checksumAddress.length - 8);
    const _tag = (style && style.forceTag == false) ?
        ellipsisAddress
        : tag ? tag : ellipsisAddress;

    const textStyle: any = {
        maxWidth: "90%"
    }
    if (style && style.color) {
        textStyle.color = style.color;
    }
    const routerTo = to ? to : "/address/" + checksumAddress;

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
            <Tooltip style={{ float: "left" }} title={(style && style.noTip) ? "" : checksumAddress}>
                {
                    (style && !style.hasLink) && <>
                        {
                            _tag && <Text ellipsis style={textStyle}>
                                {_tag}
                            </Text>
                        }
                        {
                            !_tag && style.forceTag && <Text ellipsis strong style={textStyle}>
                                {type?.toLocaleUpperCase()}
                            </Text>
                        }
                    </>
                }
                {
                    (!style || style.hasLink) && <>
                        <RouterLink to={routerTo}>
                            {
                                _tag && <Link ellipsis style={textStyle}>
                                    {_tag}
                                </Link>
                            }
                            {
                                !_tag && <Link ellipsis style={textStyle}>
                                    {ellipsisAddress}
                                </Link>
                            }
                        </RouterLink>
                    </>
                }
            </Tooltip>
            <Paragraph style={{ height: "0px", display: "inline-block" }} copyable={{ text: checksumAddress }}>
            </Paragraph>
        </Text>
    </>

}