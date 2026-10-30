export default function Button({ variant = 'default', onClick, children, type = 'button', ...rest }) {
  const className = variant === 'primary' ? 'btn primary' : 'btn'
  return (
    <button type={type} className={className} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}
