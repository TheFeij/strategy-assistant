export default function Field({ label, children, id }) {
  return (
    <div className="field" id={id}>
      <label>{label}</label>
      {children}
    </div>
  )
}
