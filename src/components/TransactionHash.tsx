
import { Typography, Tooltip } from 'antd';
import { CheckCircleTwoTone, ExclamationCircleTwoTone } from '@ant-design/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useDBStoredBlockNumber } from '../state/application/hooks';
const { Link } = Typography;


export default (
    { txhash, status, sub , blockNumber }: {
        txhash: string,
        status?: number,
        sub: number,
        blockNumber? : number
    } ) => {

    const dbStoredBlockNumber = useDBStoredBlockNumber();

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
            <RouterLink to={`/tx/${txhash}`}>
                {
                    blockNumber && blockNumber > dbStoredBlockNumber &&
                    <Link italic underline ellipsis style={{width:'80%' , marginLeft:"2px"}}>{txhash}</Link>
                }
                {
                    ((blockNumber && blockNumber <= dbStoredBlockNumber) || !blockNumber) &&
                    <Link ellipsis style={{width:'80%' , marginLeft:"2px"}}>{txhash}</Link>
                }
            </RouterLink>
        </Tooltip>
    </>)
}