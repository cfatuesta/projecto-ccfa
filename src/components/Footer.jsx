import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import logoFooter from '../images/logo footer.png';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="new-footer">
            <div className="footer-container">
                {/* Left Column: Logo */}
                <div className="footer-logo-col">
                    <Link to="/">
                        <img
                            src={logoFooter}
                            alt="Latin Run Club Logo"
                            className="footer-logo"
                        />
                    </Link>
                </div>

                {/* Right Columns: Links, Cities & Socials */}
                <div className="footer-content-col">
                    <div className="footer-links-grid">
                        <div className="footer-links-col">
                            <ul className="footer-nav-links">
                                <li><Link to="/about">{t('about_us_clean')}</Link></li>
                                <li><Link to="/community">{t('become_member')}</Link></li>
                                <li><Link to="/community">{t('become_partner')}</Link></li>
                                <li><Link to="/community">{t('apply_leadership')}</Link></li>
                                <li><Link to="/">{t('join_next_run')}</Link></li>
                            </ul>
                        </div>
                        <div className="footer-links-col">
                            <ul className="footer-nav-links">
                                <li><Link to="/">{t('nyc')}</Link></li>
                                <li><Link to="/">{t('boston_clean')}</Link></li>
                                <li><Link to="/">{t('atlanta_clean')}</Link></li>
                                <li><Link to="/">{t('washington_clean')}</Link></li>
                                <li><Link to="/">{t('london_clean')}</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-social-row">
                        <div className="footer-social-black-box">
                            <a href="https://wa.me/message/LRC" target="_blank" rel="noreferrer" className="social-icon-btn">
                                <i className="fa-brands fa-whatsapp"></i>
                            </a>
                            <a href="https://instagram.com/latinrunclub" target="_blank" rel="noreferrer" className="social-icon-btn">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a href="https://www.strava.com/clubs/latin-run-club" target="_blank" rel="noreferrer" className="social-icon-btn">
                                <i className="fa-brands fa-strava"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}