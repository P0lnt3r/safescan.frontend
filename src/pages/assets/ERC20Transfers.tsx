
import { Typography } from 'antd';
import ERC20TransferTable from './ERC20TokenTransfers';

const { Title } = Typography;

export default () => {

    return (<>
        <Title level={3}>SRC20 Token Transfers</Title>
        <ERC20TransferTable tokenAddress={undefined} filterAddress={undefined} />
    </>)
}