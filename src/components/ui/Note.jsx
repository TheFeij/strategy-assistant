export default function Note({ variant = 'default', children }) {
  const className = variant === 'default' ? 'note' : `note ${variant}`
  return <div className={className}>{children}</div>
}
