export function Card({ children, className = '' }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function SectionHeading({ icon: Icon, title, description, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-start gap-3">
      {Icon && (
        <span className="section-icon">
          <Icon size={18} aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <h2 className="section-title">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, htmlFor, icon: Icon, required = false, children, className = '' }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {required && <span className="ml-1 text-danger" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
        )}
        {children}
      </div>
    </div>
  );
}
