import { Link } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext";

export default function MainIndex() {
    const { t } = useLanguage();

    return (
        <section className="main">
            <div className="title">
                <h1 className="above">{t('latin_run')}</h1>
                <h1 className="under">{t('club')}</h1>
            </div>
            <div className="links">
                <Link to="/community" className="join">{t('join_us')}</Link>
                <Link to="/about" className="about">{t('about')}</Link>
                <Link to="/donate" className="donate">{t('donate')}</Link>
            </div>
        </section>
    )
}