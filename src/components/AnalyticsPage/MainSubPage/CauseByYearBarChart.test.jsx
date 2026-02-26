import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import CauseByYearBarChart from './CauseByYearBarChart';

const mockYearData = [
  { year: 2021, "ССЗ": 100, "Онкология": 50 },
  { year: 2022, "ССЗ": 90, "Онкология": 55 },
  { year: 2023, "ССЗ": 95, "Онкология": 60 },
];

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockYearData),
    })
  );
});

afterEach(() => jest.clearAllMocks());

jest.mock('recharts', () => {
  return {
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    Legend: () => null,
  };
});

describe('CauseByYearBarChart Component', () => {
  test('renders and fetches local json', async () => {
    await act(async () => {
      render(<CauseByYearBarChart />);
    });

    expect(screen.getByText('Смертность по нозологиям по годам')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/cause_by_year.json');
  });

  test('handles year prop change (filtering logic)', async () => {
    const { rerender } = render(<CauseByYearBarChart year="2021" />);
    
    await waitFor(() => expect(screen.getByTestId('bar-chart')).toBeInTheDocument());

    rerender(<CauseByYearBarChart year="2022" />);

    await waitFor(() => expect(screen.getByTestId('bar-chart')).toBeInTheDocument());
  });

  test('toggles info text', async () => {
    await act(async () => { render(<CauseByYearBarChart />); });

    const btn = screen.getByText('i');
    fireEvent.click(btn);
    
    expect(screen.getByText(/График показывает распределение смертности/i)).toBeInTheDocument();
  });
});