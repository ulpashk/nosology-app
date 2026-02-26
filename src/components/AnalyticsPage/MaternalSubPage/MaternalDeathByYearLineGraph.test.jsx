import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import MaternalDeathByYearLineGraph from './MaternalDeathByYearLineGraph';

const mockStats = [
  { 
    year: 2021, 
    maternal_polyclinic_coeff: 10, maternal_hospital_coeff: 5, 
    child_polyclinic_coeff: 2, child_hospital_coeff: 3,
    months: [
      { id: 1, maternal_polyclinic_coeff: 1, maternal_hospital_coeff: 1, child_polyclinic_coeff: 0, child_hospital_coeff: 0 }
    ]
  },
  { year: 2022, maternal_polyclinic_coeff: 8, maternal_hospital_coeff: 4, child_polyclinic_coeff: 1, child_hospital_coeff: 2, months: [] }
];

beforeEach(() => {
  global.fetch = jest.fn(() => 
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockStats) })
  );
});

afterEach(() => jest.clearAllMocks());

jest.mock('recharts', () => {
  return {
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    LineChart: ({ children }) => <svg data-testid="line-chart">{children}</svg>,
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    CartesianGrid: () => null,
    LabelList: () => null,
  };
});

describe('MaternalDeathByYearLineGraph Component', () => {
  test('renders correctly and fetches data', async () => {
    await act(async () => {
      render(<MaternalDeathByYearLineGraph />);
    });

    expect(screen.getByText('Материнская и Детская смертность')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  test('toggles info tooltip', async () => {
    await act(async () => { render(<MaternalDeathByYearLineGraph />); });
    fireEvent.click(screen.getByText('i'));
    expect(screen.getByText(/График показывает динамику на 1000 живорождений/i)).toBeInTheDocument();
  });

  test('switches to month mode', async () => {
    await act(async () => { render(<MaternalDeathByYearLineGraph />); });

    const monthBtn = screen.getByText('По месяцам');
    fireEvent.click(monthBtn);

    await waitFor(() => {
      expect(monthBtn).toHaveClass('bg-[#3772ff]');
      // Должен появиться select с годами
      expect(screen.getByRole('combobox')).toBeInTheDocument(); 
    });
  });
});