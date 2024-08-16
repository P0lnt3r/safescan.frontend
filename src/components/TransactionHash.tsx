
import { Typography, Tooltip } from 'antd';
import { CheckCircleTwoTone, ExclamationCircleTwoTone } from '@ant-design/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useDBStoredBlockNumber } from '../state/application/hooks';
const { Link } = Typography;


export default (
    { txhash, status , blockNumber }: {
        txhash: string,
        status?: number,
        blockNumber? : number
    } ) => {

    const dbStoredBlockNumber = useDBStoredBlockNumber();

    const tipIcon = (status?: number) => {
        if (status == 1) {
            return <></>
        } else if (status == 0) {
            return <ExclamationCircleTwoTone twoToneColor="red" />
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
                    <Link italic underline ellipsis style={{width:'90%' , marginLeft:"2px"}}>{txhash}</Link>
                }
                {
                    ((blockNumber && blockNumber <= dbStoredBlockNumber) || !blockNumber) &&
                    <Link strong ellipsis style={{width:'90%' , marginLeft:"2px"}}>{txhash}</Link>
                }
            </RouterLink>
        </Tooltip>
    </>)
}