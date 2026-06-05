import EventsPreview from '../components/EventsPreview'
import events from '../info/events.js'
import '../style/events-preview.css' // Ensure CSS is imported

const eventsPrev = events.map((event, index) => {
    return <EventsPreview
        key={index}
        {...event}
    />
})

export default function EventsContainer() {
    return (
        <section className="events-section">
            <div className="events-header">
                <h1 className="events-title">SCHEDULE<span className='dot-blue'>.</span></h1>
                <p className="events-subtitle">CITY RUNS / 2026</p>
            </div>

            <div className="events-grid">
                {eventsPrev}
            </div>

        </section>
    )
}