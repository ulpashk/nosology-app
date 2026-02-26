import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import YearDynamicsBarChart from './YearDynamicsBarChart';

const mockDynamicsData = [
  { year: 2021, count: 500, index_2021: 100, growth_percentage: 0 },
  { year: 2022, count: 550, index_2021: 110, growth_percentage: 10 }
];

beforeEach(() => {
  global.fetch = jest.fn(() => 
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockDynamicsData) })
  );
});

afterEach(() => jest.clearAllMocks());

jest.mock('recharts', () => {
  return {
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    ComposedChart: ({ children }) => <svg data-testid="composed-chart">{children}</svg>,
    Bar: () => null,
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    Cell: () => null,
    LabelList: () => null,
  };
});

describe('YearDynamicsBarChart Component', () => {
  test('renders chart with data', async () => {
    await act(async () => {
      render(<YearDynamicsBarChart year="2023" />);
    });

    expect(screen.getByText('Динамика пациентов')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
    });
  });

  test('handles loading and empty state', async () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    render(<YearDynamicsBarChart />);
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  test('handles empty data response', async () => {
    global.fetch = jest.fn(() => 
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    await act(async () => { render(<YearDynamicsBarChart />); });
    
    await waitFor(() => {
      expect(screen.getByText('Нет данных')).toBeInTheDocument();
    });
  });

  test('toggles info tooltip', async () => {
    await act(async () => { render(<YearDynamicsBarChart />); });
    fireEvent.click(screen.getByText('i'));
    expect(screen.getByText(/Устойчивый рост до 2024/i)).toBeInTheDocument();
  });
});