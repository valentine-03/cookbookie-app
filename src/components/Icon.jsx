export default function Icon({ name, label, className = '' }) {
  return (
    <span
      className={`material-symbols-rounded ${className}`.trim()}
      aria-hidden={label ? undefined : 'true'}
      aria-label={label}
    >
      {name}
    </span>
  )
}