
import { Typography, Tooltip } from 'antd';
import { BothSub } from '../utils/0xHashUtil';
import { CheckCircleTwoTone, ExclamationCircleTwoTone } from '@ant-design/icons';
import NavigateLink from './NavigateLink';
const { Link } = Typography;

export default (
    { txhash, status, sub }: {
        txhash: string,
        status?: number,
        sub: number
    }) => {
    let tag = BothSub(txhash, sub);
    const tipIcon = (status?: number) => {
        if (status == 1) {
            return <CheckCircleTwoTone twoToneColor="#52c41a" />
        } else if (status == 0) {
            return <ExclamationCircleTwoTone twoToneColor="#52c41a" />
        }
        return <></>
    }
    return (<>
        <Tooltip>
            {
                tipIcon(status)
            }
        </Tooltip>
        <Tooltip title={txhash}>
            <NavigateLink path={`/tx/${txhash}`}>
                {tag}
            </NavigateLink>
        </Tooltip>
    </>)
}