import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import DeathByYearLineGraph from './DeathByYearLineGraph';

const mockYearData = [
  { year: 2021, count: 100, months: [{ month: 1, m_count: 10 }] },
  { year: 2022, count: 90, months: [{ month: 1, m_count: 9 }] }
];
const mockAvgMonthData = [
  { month: 1, count: 50 },
  { month: 2, count: 45 }
];

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('stat_by_year')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockYearData) });
    }
    if (url.includes('stat_by_months')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockAvgMonthData) });
    }
    return Promise.reject(new Error('Unknown API'));
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
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

describe('DeathByYearLineGraph Component', () => {
  test('renders title and fetches data', async () => {
    await act(async () => {
      render(<DeathByYearLineGraph />);
    });

    expect(screen.getByText(/Смертность по годам и месяцам/i)).toBeInTheDocument();
    expect(screen.getByText('i')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  test('toggles info popup when clicking "i" button', async () => {
    await act(async () => {
      render(<DeathByYearLineGraph />);
    });

    const infoBtn = screen.getByText('i');
    fireEvent.click(infoBtn);

    expect(screen.getByText(/На графике представлена динамика/i)).toBeInTheDocument();
    
    fireEvent.click(infoBtn);
    expect(screen.queryByText(/На графике представлена динамика/i)).not.toBeInTheDocument();
  });

  test('switches modes (buttons)', async () => {
    await act(async () => {
      render(<DeathByYearLineGraph />);
    });

    const yearBtn = screen.getByText('По годам');
    expect(yearBtn).toHaveClass('bg-[#3772ff]');

    const avgBtn = screen.getByText('По месяцам (ср)');
    fireEvent.click(avgBtn);
    
    await waitFor(() => {
        expect(avgBtn).toHaveClass('bg-[#3772ff]');
    });
  });

  test('shows year selector when "По месяцам года" is active', async () => {
    await act(async () => {
      render(<DeathByYearLineGraph />);
    });

    const monthYearBtn = screen.getByText('По месяцам года');
    fireEvent.click(monthYearBtn);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveValue('2021');
    });
  });
});