export default function Loading() {
  return (
    <>
      <div className="ph" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          {/* Skeleton Title */}
          <div className="skeleton-pulse clay-raised" style={{ width: 250, height: 32, borderRadius: 8, marginBottom: 8 }}></div>
        </div>
      </div>

      <div className="scroll-container">
        {/* Skeleton Pebbles */}
        <div className="pebble-cluster skeleton-pulse">
          <div className="clay-raised pebble hero" style={{ height: 200 }}></div>
          <div className="clay-raised pebble" style={{ height: 200 }}></div>
          <div className="clay-raised pebble" style={{ height: 200 }}></div>
          <div className="clay-raised pebble" style={{ height: 200 }}></div>
        </div>

        {/* Skeleton Charts */}
        <div className="charts-grid skeleton-pulse">
          <div className="clay-raised chart-card" style={{ height: 400, gridColumn: 'span 2' }}></div>
          <div className="clay-raised chart-card" style={{ height: 400 }}></div>
          <div className="clay-raised chart-card" style={{ height: 400 }}></div>
        </div>
      </div>
    </>
  )
}
