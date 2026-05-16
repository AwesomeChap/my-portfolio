import React from 'react';
import '../../styles/maintenance.scss';

export default function MaintenanceBlock({
  eyebrow = 'Maintenance in progress',
  title = "We'll be right back",
  text,
  className = '',
}) {
  return (
    <div
      className={['page-maintenance', className].filter(Boolean).join(' ')}
      role="status"
      aria-live="polite"
    >
      <div className="page-maintenance__ambient" aria-hidden="true" />
      <div className="page-maintenance__content">
        <div className="page-maintenance__loader" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              className="page-maintenance__loader-cell"
              style={{ animationDelay: `${i * 0.14}s` }}
            />
          ))}
        </div>
        <p className="page-maintenance__eyebrow">{eyebrow}</p>
        <p className="page-maintenance__title">{title}</p>
        <p className="page-maintenance__text">{text}</p>
        <div className="page-maintenance__rule" aria-hidden="true" />
      </div>
    </div>
  );
}
