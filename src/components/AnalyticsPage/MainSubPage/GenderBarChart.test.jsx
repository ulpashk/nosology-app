import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import GenderBarChart from './GenderBarChart';

const mockData = [
  { gender: "Мужской", count: 120, avg_age: 65.5 },
  { gender: "Женский", count: 80, avg_age: 72.3 }
];

beforeEach(() => {
  global.fetch = jest.fn(() => 
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockData) })
  );
});

afterEach(() => jest.clearAllMocks());

jest.mock('recharts', () => {
  return {
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    PieChart: ({ children }) => <svg data-testid="pie-chart">{children}</svg>,
    Pie: ({ data }) => <g data-testid="pie-segments">{data.map((_, i) => <circle key={i} />)}</g>,
    Cell: () => null,
    Tooltip: () => null,
    Legend: () => null,
  };
});

describe('GenderBarChart Component', () => {
  test('renders loading state initially', async () => {
    global.fetch = jest.fn(() => new Promise(() => {})); 
    render(<GenderBarChart />);
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  test('renders data and average age correctly', async () => {
    await act(async () => {
      render(<GenderBarChart year="2023" />);
    });

    expect(screen.getByText('Распределение по полу')).toBeInTheDocument();
    
    await waitFor(() => {
        expect(screen.getByText(/Ж: 72.3/)).toBeInTheDocument();
        expect(screen.getByText(/М: 65.5/)).toBeInTheDocument();
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });
  });

  test('handles empty data', async () => {
    global.fetch = jest.fn(() => 
        Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    await act(async () => {
      render(<GenderBarChart />);
    });

    await waitFor(() => {
        expect(screen.getByText('Нет данных')).toBeInTheDocument();
    });
  });

  test('toggles info tooltip', async () => {
    await act(async () => { render(<GenderBarChart />); });
    
    fireEvent.click(screen.getByText('i'));
    expect(screen.getByText(/Женщины имеют более высокий средний возраст/i)).toBeInTheDocument();
  });
});