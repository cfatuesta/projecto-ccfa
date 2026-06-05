import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function EventsPreview(props) {
    const [isHovered, setIsHovered] = useState(false);
    const { t } = useLanguage();

    // City colors mapping (fallback if props.color isn't passed ideally, but data has it)
    // We rely on props.color from the updated events.js

    return (
        <div
            className='event-card group'
            style={{
                backgroundColor: isHovered ? props.color : '#F2EFEB',
                color: isHovered ? 'white' : 'black',
                borderTop: isHovered ? `8px solid ${props.color}` : `8px solid ${props.color}`
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="card-top">
                <p className='event-date'>{props.date}</p>
                <h2 className='event-name'>{props.runName}</h2>
                <div className="event-info">
                    <span>{props.distance}</span>
                    <span className="separator">•</span>
                    <span>{props.level}</span>
                    <span className="separator">•</span>
                    <span>{props.type}</span>
                </div>
            </div>

            <div className="card-bottom">

                {/* Dynamic divider color based on background contrast */}
                <div className="card-divider" style={{ backgroundColor: isHovered ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)' }}></div>

                <div className="card-footer">
                    <span className="view-details">{t('view_details')}</span>
                    <span className="arrow-icon">↗</span>
                </div>
            </div>
        </div>
    )
}