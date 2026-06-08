import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CarbonCalculator from '../CarbonCalculator';

describe('CarbonCalculator React Component', () => {
  const defaultInputs = {
    electricity: 350,
    gas: 200,
    carDist: 600,
    carType: 'petrol',
    publicTransit: 15,
    flightsShort: 6,
    flightsLong: 10,
    diet: 'averageMeat'
  };

  it('renders active step titles and slides correctly', () => {
    const setInputsMock = vi.fn();
    render(<CarbonCalculator inputs={defaultInputs} setInputs={setInputsMock} />);
    
    // First step is "Energy & Heating"
    expect(screen.getByText('Energy & Heating')).toBeInTheDocument();
    expect(screen.getByLabelText('Electricity Usage (kWh/month)')).toBeInTheDocument();
  });

  it('triggers setInputs callback when electricity input value changes', () => {
    const setInputsMock = vi.fn();
    render(<CarbonCalculator inputs={defaultInputs} setInputs={setInputsMock} />);

    const numInput = screen.getByLabelText('Electricity Usage (kWh/month)');
    
    fireEvent.change(numInput, { target: { value: '450' } });
    
    // Check if the setInputs callback was fired
    expect(setInputsMock).toHaveBeenCalled();
  });

  it('navigates to next step and renders Commute inputs', () => {
    const setInputsMock = vi.fn();
    render(<CarbonCalculator inputs={defaultInputs} setInputs={setInputsMock} />);

    // Click "Next" button to go to step 2 (Commute)
    const nextBtn = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextBtn);

    // Step 2 title should be "Commute & Travel"
    expect(screen.getByText('Commute & Travel')).toBeInTheDocument();
    expect(screen.getByText('Primary Car Engine')).toBeInTheDocument();
  });
});
