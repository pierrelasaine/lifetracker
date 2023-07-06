import './LandingPage.css'

export default function LandingPage() {
    return (
        <section className='landing-page'>
            <div className='hero'>
                <div className='cta'>
                    <h1>LifeTracker</h1>
                    <h2>Helping you take back control of your world.</h2>
                </div>
                <img
                    className='hero-img'
                    src='https://lifetracker.up.railway.app/assets/tracker-2a96bfd0.jpg'
                    alt='hero'
                />
            </div>
        </section>
    )
}
