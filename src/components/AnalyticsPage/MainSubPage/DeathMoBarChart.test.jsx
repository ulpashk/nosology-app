import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import DeathMoBarChart from './DeathMoBarChart';

const mockMoData = {
  results: [
    { name: "Городская больница №1", count: 50 },
    { name: "Центральная клиника", count: 40 }
  ]
};

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockMoData),
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
    Cell: () => null,
    LabelList: () => null,
  };
});

describe('DeathMoBarChart Component', () => {
  test('renders chart with data', async () => {
    await act(async () => {
      render(<DeathMoBarChart year="2024" />);
    });

    expect(screen.getByText('Топ-10 Смертей по МО')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  test('shows empty state when results are empty', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ results: [] }) })
    );

    await act(async () => {
      render(<DeathMoBarChart />);
    });

    await waitFor(() => {
      expect(screen.getByText('Нет данных')).toBeInTheDocument();
    });
  });

  test('shows info tooltip content', async () => {
    await act(async () => { render(<DeathMoBarChart />); });
    
    const btn = screen.getByText('i');
    fireEvent.click(btn);
    
    expect(screen.getByText(/Данные отражают медицинские организации/i)).toBeInTheDocument();
  });
});