import SearchComponent from '../../components/SearchComponent';
import './index.css';

export default function HeroSection() {
    return (
        <section className="home-hero">
            <div className="site-container home-hero-inner">
                <h1 className="home-hero-title">Safe4 Blockchain Explorer</h1>
                <div className="home-hero-search">
                    <SearchComponent hero />
                </div>
            </div>
        </section>
    );
}
