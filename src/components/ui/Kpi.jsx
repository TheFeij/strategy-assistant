export default function Kpi({ label, value, sub }) {
  return (
    <div className="kpi">
      <small>{label}</small>
      <strong>{value}</strong>
      {sub ? <small>{sub}</small> : null}
    </div>
  )
}
