import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CircularProgress from '../CircularProgress';

describe('CircularProgress Component', () => {
  const statusMock = {
    color: 'text-eco-400 bg-eco-500/10 border-eco-500/30',
    strokeColor: '#10b981',
    badge: 'Eco Champion',
    description: 'Your footprint matches global climate stability goals.'
  };

  it('renders progress value, label, and description correctly', () => {
    render(<CircularProgress value={1.85} max={15} status={statusMock} />);
    
    expect(screen.getByText('1.85')).toBeInTheDocument();
    expect(screen.getByText('t CO₂e / yr')).toBeInTheDocument();
    expect(screen.getByText('Eco Champion')).toBeInTheDocument();
    expect(screen.getByText('Your footprint matches global climate stability goals.')).toBeInTheDocument();
  });
});
