import { Link as RouterLink } from 'react-router-dom';
import { Typography } from 'antd';
import { useDBStoredBlockNumber } from '../state/application/hooks';

const { Link } = Typography;

export default ({ blockNumber, confirmed }: {
    blockNumber: number,
    confirmed?: number,
    showConfirmed ?: false,
}) => {
    const dbStoredBlockNumber = useDBStoredBlockNumber();
    const Render = () => {
        if (confirmed == undefined ) {
            return <RouterLink to={`/block/${blockNumber}`}>
                {blockNumber}
            </RouterLink>
        } else {
            if (confirmed == 1 || blockNumber <= dbStoredBlockNumber) {
                return <RouterLink to={`/block/${blockNumber}`}>
                    <Link strong>{blockNumber}</Link>
                </RouterLink>
            } else {
                return <RouterLink to={`/block/${blockNumber}`}>
                    <Link italic underline>{blockNumber}</Link>
                </RouterLink>
            }
        }
    }
    return <>
        {
            Render()
        }
    </>
}