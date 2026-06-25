import { VerticalAlignTopOutlined } from '@ant-design/icons';

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="app-footer">
            <div className="site-container app-footer-inner">
                <button type="button" className="app-footer-back-top" onClick={scrollToTop}>
                    <VerticalAlignTopOutlined />
                    Back to Top
                </button>
            </div>
        </footer>
    );
}
