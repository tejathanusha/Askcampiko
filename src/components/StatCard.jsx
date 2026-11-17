function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "purple",
  onClick,
}) {
  return (
    <div
      className={`stat-card stat-card-${variant}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="stat-card-top">
        <div className="stat-card-icon">
          {Icon && <Icon size={21} strokeWidth={2.1} />}
        </div>

        {onClick && (
          <span className="stat-card-arrow">
            →
          </span>
        )}
      </div>

      <div className="stat-card-content">
        <p>{title}</p>

        <h3>{value}</h3>

        {subtitle && (
          <span>{subtitle}</span>
        )}
      </div>
    </div>
  );
}

export default StatCard;