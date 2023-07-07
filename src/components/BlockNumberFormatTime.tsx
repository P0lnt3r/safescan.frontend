import { useBlockNumber, useBlockTimestamp } from "../state/application/hooks"
import { DateFormat } from "../utils/DateUtil";
import { Tooltip, Typography } from 'antd';

const { Text, Link } = Typography;

export default ({ blockNumber }: {
    blockNumber: number
}) => {
    const latestBlockNumber = useBlockNumber();
    const latestBlockTimestamp = useBlockTimestamp();
    return <>
        {
            (blockNumber - latestBlockNumber > 0) &&
            <Tooltip title={`${blockNumber}`}>
                <Text strong type="secondary">
                    {DateFormat(((blockNumber - latestBlockNumber) * 30 + latestBlockTimestamp) * 1000)}
                </Text>
            </Tooltip>
        }
    </>
}