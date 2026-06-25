import './index.css';
import HeroSection from './HeroSection';
import LatestBlockTransactions from './LatestBlockTransactions';
import Statistics from './Statistics';

export default function Index() {
    return (
        <div className="home-page">
            <HeroSection />
            <div className="home-stats-wrap">
                <Statistics />
            </div>
            <LatestBlockTransactions />
        </div>
    );
}
