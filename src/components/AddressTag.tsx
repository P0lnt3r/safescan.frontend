
import { Typography, Tooltip } from 'antd';
import { useAddressProp } from '../state/application/hooks';
import { BothSub } from '../utils/0xHashUtil';
const { Link } = Typography;

export default (
    { address, sub }: {
        address: string,
        sub: number
    }) => {
    const addressProp = useAddressProp(address);    
    const tag = addressProp?.tag    
    const subAddress = BothSub(address, sub);
    return (<>
        <Tooltip title={address}>
            <Link href={`/address/${address}`} target="_blank">
                {tag ? tag : subAddress}
            </Link>
        </Tooltip>
    </>)
}