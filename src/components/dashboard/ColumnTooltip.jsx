import React, { useState } from 'react';

/**
 * ColumnTooltip — An accessible info-icon tooltip for data table column headers.
 * Shows a definition panel on hover/focus so officials understand what each metric means.
 *
 * @param {string} label  - The column header text (used for aria-label)
 * @param {string} definition - The plain-English explanation of the metric
 */
const ColumnTooltip = ({ label, definition }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span className="column-tooltip-wrapper">
      <button
        type="button"
        className="column-tooltip-trigger"
        aria-label={`Info about ${label}`}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        ⓘ
      </button>
      {visible && (
        <span className="column-tooltip-panel" role="tooltip">
          <strong>{label}</strong>
          <span className="column-tooltip-divider" />
          <span>{definition}</span>
        </span>
      )}
    </span>
  );
};

export default ColumnTooltip;
