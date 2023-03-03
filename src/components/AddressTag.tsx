
import { Typography, Tooltip } from 'antd';
import { useAddressProp } from '../state/application/hooks';
import { BothSub } from '../utils/0xHashUtil';
const { Link } = Typography;

export enum ShowStyle {
    DEFAULT = 0,
    NO_LINK = 1,
}

export default (
    { address, sub, showStyle }: {
        address: string,
        sub: number,
        showStyle?: ShowStyle
    }) => {
    const addressProp = useAddressProp(address);
    const tag = addressProp?.tag
    const subAddress = BothSub(address, sub);
    showStyle = showStyle ? showStyle : ShowStyle.DEFAULT;
    
        console.log(showStyle);

    return (<>
        {
            showStyle === ShowStyle.DEFAULT &&
            <Tooltip title={address}>
                <Link href={`/address/${address}`}>
                    {tag ? tag : subAddress}
                </Link>
            </Tooltip>
        }
        {
            showStyle === ShowStyle.NO_LINK &&
            <Tooltip title={address}>
                {tag ? tag : subAddress}
            </Tooltip>
        }
    </>)
}