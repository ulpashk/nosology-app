import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import DeathCauseBarChart from './DeathCauseBarChart';

const mockCauseData = [
  { name: "Ишемическая болезнь сердца", count: 150 },
  { name: "Инсульт", count: 100 }
];

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockCauseData),
    })
  );
});

afterEach(() => jest.clearAllMocks());

jest.mock('recharts', () => {
  return {
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    BarChart: ({ children }) => <svg data-testid="bar-chart">{children}</svg>,
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    CartesianGrid: () => null,
    LabelList: () => null,
    Cell: () => null,
  };
});

describe('DeathCauseBarChart Component', () => {
  test('renders successfully and calls fetch', async () => {
    await act(async () => {
      render(<DeathCauseBarChart year="2022" />);
    });

    expect(screen.getByText('ТОП-10 Причин смерти')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
    
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('stat_by_death_cause'));
  });

  test('handles empty data', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    await act(async () => {
      render(<DeathCauseBarChart />);
    });

    await waitFor(() => {
      expect(screen.getByText('Нет данных')).toBeInTheDocument();
    });
  });

  test('handles fetch error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest.fn(() => Promise.reject("Network Error"));

    await act(async () => {
      render(<DeathCauseBarChart />);
    });

    await waitFor(() => {
      expect(screen.getByText('Нет данных')).toBeInTheDocument();
    });
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('toggles info tooltip', async () => {
    await act(async () => { render(<DeathCauseBarChart />); });
    
    fireEvent.click(screen.getByText('i'));
    expect(screen.getByText(/Большая часть смертности/i)).toBeInTheDocument();
  });
});