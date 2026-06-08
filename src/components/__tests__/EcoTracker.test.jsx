import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import EcoTracker from '../EcoTracker';

describe('EcoTracker Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders title, daily challenges, and unlocked badges list', () => {
    render(<EcoTracker />);
    
    expect(screen.getByText('Eco Action Tracker')).toBeInTheDocument();
    expect(screen.getByText('Daily Challenges')).toBeInTheDocument();
    expect(screen.getByText('Unlocked Badges')).toBeInTheDocument();
    
    // First badge is "Green Sprout" (requires 0 XP, so it is unlocked initially)
    expect(screen.getAllByText('Green Sprout')[0]).toBeInTheDocument();
  });

  it('completes a challenge and increments the XP score', () => {
    render(<EcoTracker />);

    // Click "Zero Single-Use Plastic" challenge (+25 XP)
    const challengeBtn = screen.getByRole('button', { name: /toggle daily challenge: zero single-use plastic/i });
    fireEvent.click(challengeBtn);

    // XP earned should be 25
    expect(screen.getByText('25 Total XP earned')).toBeInTheDocument();

    // Check LocalStorage value
    expect(localStorage.getItem('antiquity_xp')).toBe('25');
  });
});
