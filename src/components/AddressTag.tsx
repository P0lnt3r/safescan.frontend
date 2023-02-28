
import { Typography, Tooltip } from 'antd';
import { BothSub } from '../utils/0xHashUtil';
const { Link } = Typography;

export default (
    { address, sub }: {
        address: string,
        sub: number
    }) => {
    let tag = BothSub(address, sub);
    return (<>
        <Tooltip title={address}>
            <Link href={`/address/${address}`} target="_blank">
                {tag}
            </Link>
        </Tooltip>
    </>)
}