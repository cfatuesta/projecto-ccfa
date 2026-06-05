import { useLanguage } from "../context/LanguageContext";

export default function Excuse() {
    const { t } = useLanguage();

    return (
        <section className="excuse-container">
            <div className="excuse-content">
                <div className="excuse-left">
                    <h1 className="excuse-title">{t('running_is_just_an')} <br /><span className="text-pink">{t('excuse')}</span> <br />{t('to_hang_out_with_friends')}</h1>
                    <div className="excuse-quote">
                        <p className="quote-bar"></p>
                        <p className="quote-text">"{t('quote')}"</p>
                    </div>
                </div>

                <div className="excuse-right">
                    <img src="https://images.squarespace-cdn.com/content/v1/68db0c4bc7a5784954344962/381b97a5-a2e5-43ce-ba2f-428c5f4ae95e/IMG_7748.jpeg?format=1500w" alt="Runner stretching" className="excuse-img" />
                    <h2 className="excuse-subtitle">
                        {t('subtitle_part1')} <br />
                        <span className="underline-orange">{t('subtitle_part2')}</span>
                    </h2>
                </div>
            </div>
        </section>
    )
}