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

const { Content } = Layout;

function App() {
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 0%' }}>
        <BrowserRouter>
          <Header />
          <div className="site-layout-content">
            <Routes>
              <Route path="/" index element={<Index />} />
              <Route path="/blocks" index element={<Blocks />} />
              <Route path="/block/:height" index element={<BlockDetail />} />
              <Route path="/addresses" index element={<Addresses />} />
              <Route path="/address/:address" index element={<AddressDetail />} />
              <Route path="/txs" index element={<Txs />} />
              <Route path="/tx/:txHash" index element={<TxDetail />} />
              <Route path="/txsInternal" index element={<TxsInternal />} />
              <Route path="/accounts" index element={<RankAddress />} />
              <Route path="/assets/erc20tokens" index element={<ERC20Tokens />} />
              <Route path="/assets/erc20txns" index element={<ERC20Transfers />} />
            </Routes>
          </div>
        </BrowserRouter>
      </Content>
      <Footer />
    </Layout>
  );
}

export default App;
