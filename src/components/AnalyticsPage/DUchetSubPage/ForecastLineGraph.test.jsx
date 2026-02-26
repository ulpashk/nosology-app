import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import ForecastLineGraph from './ForecastLineGraph';

const mockForecastData = {
  results: [
    { date: "2020-05-01", registry_count: 100, deaths_count: 10, registry_forecast: 0, deaths_forecast: 0 },
    { date: "2023-05-01", registry_count: 200, deaths_count: 20, registry_forecast: 205, deaths_forecast: 22 }
  ]
};

beforeEach(() => {
  global.fetch = jest.fn(() => 
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockForecastData) })
  );
});

afterEach(() => jest.clearAllMocks());

jest.mock('recharts', () => {
  return {
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    LineChart: ({ children }) => <svg data-testid="line-chart">{children}</svg>, // SVG для безопасности
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    CartesianGrid: () => null,
  };
});

describe('ForecastLineGraph Component', () => {
  test('renders and processes data correctly', async () => {
    await act(async () => {
      render(<ForecastLineGraph />);
    });

    expect(screen.getByText('Прогноз до 2030 года')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
    
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('forecast-nosology'));
  });

  test('toggles info tooltip', async () => {
    await act(async () => { render(<ForecastLineGraph />); });

    const btn = screen.getByText('i');
    fireEvent.click(btn);
    
    expect(screen.getByText(/Gradient Boosting/i)).toBeInTheDocument();
  });
});