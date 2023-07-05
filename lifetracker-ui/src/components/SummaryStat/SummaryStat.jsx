export default function SummaryStat({ stat, label, substat }) {
    return (
        <div className='summary-stat'>
            <span className='primary-statistic'>{stat} </span>
            <span className='stat-label'>{label} </span>
            <span className='secondary-statistic'>{substat} </span>
        </div>
    )
}
