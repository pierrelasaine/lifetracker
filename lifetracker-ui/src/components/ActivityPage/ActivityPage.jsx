import ActivityFeed from '../ActivityFeed/ActivityFeed'
import Loading from '../Loading/Loading'

export default function ActivityPage({ appState, setAppState }) {
    const { isProcessing } = appState

    if (isProcessing) {
        return <Loading />
    }

    return (
        <div className='activity-page'>
            <ActivityFeed />
        </div>
    )
}
