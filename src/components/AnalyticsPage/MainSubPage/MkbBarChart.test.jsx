import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import MKBBarChart from './MkbBarChart';

const mockMkbData = [
  { name: "Болезни системы кровообращения", count: 500 },
  { name: "Новообразования", count: 300 },
];

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockMkbData),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

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

describe('MKBBarChart Component', () => {
  test('renders title and loading state', async () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    
    render(<MKBBarChart />);
    expect(screen.getByText('Топ-10 МКБ группы')).toBeInTheDocument();
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  test('renders chart with data', async () => {
    await act(async () => {
      render(<MKBBarChart year="2023" month="01" />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('year=2023')
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('month=01')
    );
  });

  test('shows empty state when no data', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    await act(async () => {
      render(<MKBBarChart />);
    });

    await waitFor(() => {
      expect(screen.getByText('Нет данных')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });
  });

  test('toggles info tooltip', async () => {
    await act(async () => { render(<MKBBarChart />); });

    const infoBtn = screen.getByText('i');
    fireEvent.click(infoBtn);
    
    expect(screen.getByText(/Сердечно-сосудистые, неврологические заболевания/i)).toBeInTheDocument();
    
    fireEvent.click(infoBtn);
    expect(screen.queryByText(/Сердечно-сосудистые, неврологические заболевания/i)).not.toBeInTheDocument();
  });
});