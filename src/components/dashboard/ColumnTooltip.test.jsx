// src/components/dashboard/ColumnTooltip.test.jsx
// TDD: These tests define the contract for the ColumnTooltip component BEFORE it exists.

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ColumnTooltip from './ColumnTooltip';

describe('ColumnTooltip', () => {
  it('renders an info icon button for the given label', () => {
    render(<ColumnTooltip label="Health Index" definition="A test definition." />);
    const btn = screen.getByRole('button', { name: /health index/i });
    expect(btn).toBeTruthy();
  });

  it('does NOT show the definition text before interaction', () => {
    render(<ColumnTooltip label="Avg Risk Score" definition="The average ML-derived risk." />);
    expect(screen.queryByText(/The average ML-derived risk/i)).toBeNull();
  });

  it('shows the definition text when the info button is focused', () => {
    render(<ColumnTooltip label="Avg Risk Score" definition="The average ML-derived risk." />);
    const btn = screen.getByRole('button', { name: /avg risk score/i });
    fireEvent.focus(btn);
    expect(screen.getByText(/The average ML-derived risk/i)).toBeTruthy();
  });

  it('hides the definition text when the button loses focus', () => {
    render(<ColumnTooltip label="Avg Risk Score" definition="The average ML-derived risk." />);
    const btn = screen.getByRole('button', { name: /avg risk score/i });
    fireEvent.focus(btn);
    fireEvent.blur(btn);
    expect(screen.queryByText(/The average ML-derived risk/i)).toBeNull();
  });

  it('shows the definition text on mouseenter', () => {
    render(<ColumnTooltip label="Avg Teacher Load" definition="Pupil-Teacher Ratio (PTR)." />);
    const btn = screen.getByRole('button', { name: /avg teacher load/i });
    fireEvent.mouseEnter(btn);
    expect(screen.getByText(/Pupil-Teacher Ratio/i)).toBeTruthy();
  });

  it('hides the definition text on mouseleave', () => {
    render(<ColumnTooltip label="Avg Teacher Load" definition="Pupil-Teacher Ratio (PTR)." />);
    const btn = screen.getByRole('button', { name: /avg teacher load/i });
    fireEvent.mouseEnter(btn);
    fireEvent.mouseLeave(btn);
    expect(screen.queryByText(/Pupil-Teacher Ratio/i)).toBeNull();
  });

  it('renders correctly with a "Critical Schools" label', () => {
    const def = "Count of schools classified as High risk by the ML engine.";
    render(<ColumnTooltip label="Critical Schools" definition={def} />);
    expect(screen.getByRole('button', { name: /critical schools/i })).toBeTruthy();
  });

  it('renders correctly with a "Health Index" label', () => {
    const def = "Visual indicator: 100 minus the Average Risk Score. A longer green bar means a healthier district.";
    render(<ColumnTooltip label="Health Index" definition={def} />);
    expect(screen.getByRole('button', { name: /health index/i })).toBeTruthy();
  });
});
