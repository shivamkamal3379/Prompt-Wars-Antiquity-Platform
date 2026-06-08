import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Welcome from '../Welcome';

describe('Welcome Component', () => {
  it('renders welcome screen titles and description correctly', () => {
    const onEnterMock = vi.fn();
    render(<Welcome onEnter={onEnterMock} />);
    
    expect(screen.getByText('“Our planet breathes. Every choice leaves a trace.”')).toBeInTheDocument();
    expect(screen.getByText('Antiquity')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /begin your journey/i })).toBeInTheDocument();
  });

  it('triggers onEnter callback after timer delay when button is clicked', () => {
    vi.useFakeTimers();
    const onEnterMock = vi.fn();
    render(<Welcome onEnter={onEnterMock} />);

    const button = screen.getByRole('button', { name: /begin your journey/i });
    fireEvent.click(button);

    // Fast-forward exit transition timer
    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(onEnterMock).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
