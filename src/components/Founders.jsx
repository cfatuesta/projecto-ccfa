import React from 'react';

export default function Founders(props) {
    return (
        <div className="founder-card" style={{ '--founder-color': props.color || '#fff' }}>
            <div className="founder-img-container">
                <img
                    src={props.image.src}
                    alt={props.image.alt}
                    className="founder-img"
                />
            </div>
            <h3 className="founder-name">{props.name}</h3>
        </div>
    )
}