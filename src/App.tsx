import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Index from './pages/index/index';
import Blocks from './pages/blocks';
import BlockDetail from './pages/blocks/Detail';
import Addresses from './pages/addresses';
import AddressDetail from './pages/addresses/Detail';
import Txs from './pages/txs';
import TxDetail from './pages/txs/Detail';
import TxsInternal from './pages/txsInternal';
import { Routes, Router, Route, BrowserRouter } from 'react-router-dom'
import { Breadcrumb, Layout, Menu } from 'antd';
import RankAddress from './pages/statistics/RankAddress';
import ERC20Tokens from './pages/assets/ERC20Tokens';
import ERC20Transfers from './pages/assets/ERC20Transfers';
import SuperNodes from './pages/nodes/SuperNodes';
import MasterNodes from './pages/nodes/MasterNodes';
import AccountRecords from './pages/assets/AccountRecords';
import PendingTxns from './pages/txs/PendingTxns';
import Token from './pages/assets/Token';
import AddressTokenHoldings from './pages/addresses/AddressTokenHoldings';
import NftTransfers from './pages/assets/NftTransfers';
import NftTokens from './pages/assets/NftTokens';
import Nft from './pages/assets/Nft';
import Charts from './pages/statistics/Charts';
import PageChartCirculation from './pages/statistics/Page-Chart-Circulation';
import PageChartTxns from './pages/statistics/Page-Chart-Txns';
import PageChartAddresses from './pages/statistics/Page-Chart-Addresses';
import PageChartBlocksRewards from './pages/statistics/Page-Chart-BlocksRewards';
import PageChartGasUseds from './pages/statistics/Page-Chart-GasUseds';
import PageChartAverageBlockTimes from './pages/statistics/Page-Chart-AverageBlockTimes';
import PageChartMasternodes from './pages/statistics/Page-Chart-Masternodes';
import PageChartSupernodes from './pages/statistics/Page-Chart-Supernodes';
import Node_Detail from './pages/nodes/Node_Detail';
import AccountRecord from './pages/assets/AccountRecord';
import VerifyContract from './pages/verify/verifyContract';
import VerifyContractSolc from './pages/verify/verifyContract-solc';
import Contracts from './pages/contracts';
import VerifyContractSolcJson from './pages/verify/verifyContract-solc-json';
import Safe3Redeem from './pages/statistics/safe3/Safe3Redeem';
import Crosschains from './pages/crosschain/Crosschains';

const { Content } = Layout;

function App() {
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 0%' }}>
        <BrowserRouter>
          <Header />
          <div className="site-layout-content" style={{ maxWidth: "2000px", margin: "auto" }}>
            <Routes>
              <Route path="/" index element={<Index />} />
              <Route path="/blocks" index element={<Blocks />} />
              <Route path="/block/:height" index element={<BlockDetail />} />
              <Route path="/addresses" index element={<Addresses />} />
              <Route path="/address/:address" index element={<AddressDetail />} />
              <Route path="/txs" index element={<Txs />} />
              <Route path="/tx/:txHash" index element={<TxDetail />} />
              <Route path="/txsInternal" index element={<TxsInternal />} />
              <Route path="/txsPending" index element={<PendingTxns />} />
              <Route path="/accounts" index element={<RankAddress />} />
              <Route path="/assets/accountrecords" index element={<AccountRecords />} />
              <Route path="/assets/accountrecords/:recordId" index element={<AccountRecord />} />
              <Route path="/assets/erc20tokens" index element={<ERC20Tokens />} />
              <Route path="/assets/nft-tokens" index element={<NftTokens />} />
              <Route path="/assets/erc20txns" index element={<ERC20Transfers />} />
              <Route path="/assets/nft-transfers" index element={<NftTransfers />} />
              <Route path="/nodes/supernodes" index element={<SuperNodes />} />
              <Route path="/nodes/masternodes" index element={<MasterNodes />} />
              <Route path="/node/:address" index element={<Node_Detail />} />
              <Route path="/charts" index element={<Charts />} />
              <Route path="/charts/circulation" index element={<PageChartCirculation />} />
              <Route path="/charts/txns" index element={<PageChartTxns />} />
              <Route path="/charts/addresses" index element={<PageChartAddresses />} />
              <Route path="/charts/blocksrewards" index element={<PageChartBlocksRewards />} />
              <Route path="/charts/gasuseds" index element={<PageChartGasUseds />} />
              <Route path="/charts/avgblocktimes" index element={<PageChartAverageBlockTimes />} />
              <Route path="/charts/masternodes" index element={<PageChartMasternodes />} />
              <Route path="/charts/supernodes" index element={<PageChartSupernodes />} />
              <Route path="/token/:address" index element={<Token />} />
              <Route path="/tokenholdings" index element={<AddressTokenHoldings />} />
              <Route path="/nft/:token/:tokenId" index element={<Nft />} />
              <Route path="/contracts" index element={<Contracts />} />
              <Route path="/verifyContract" index element={<VerifyContract />} />
              <Route path="/verifyContract-solc" index element={<VerifyContractSolc />} />
              <Route path="/verifyContract-solc-json" index element={<VerifyContractSolcJson />} />
              <Route path="/safe3/redeem" index element={<Safe3Redeem />} />
              <Route path="/crosschains" index element={<Crosschains />} />
            </Routes>
          </div>
        </BrowserRouter>
      </Content>
      <Footer />
    </Layout>
  );
}

export default App;
