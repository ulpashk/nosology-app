import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import SeasonsBarChart from './SeasonsBarChart';

const mockSeasonsData = {
  seasons: [
    { label: "Зима", average_value: 150 },
    { label: "Лето", average_value: 120 }
  ]
};

beforeEach(() => {
  global.fetch = jest.fn(() => 
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockSeasonsData) })
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
    Cell: () => null,
    LabelList: () => null,
  };
});

describe('SeasonsBarChart Component', () => {
  test('renders successfully with data', async () => {
    await act(async () => {
      render(<SeasonsBarChart year="2023" month="05" />);
    });

    expect(screen.getByText('Смертность по сезонам')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  test('toggles info tooltip', async () => {
    await act(async () => { render(<SeasonsBarChart />); });

    const btn = screen.getByText('i');
    fireEvent.click(btn);
    
    expect(screen.getByText(/Зима: рост ССЗ/i)).toBeInTheDocument();
  });

  test('shows empty state when no data', async () => {
    global.fetch = jest.fn(() => 
      Promise.resolve({ ok: true, json: () => Promise.resolve({ seasons: [] }) })
    );

    await act(async () => {
      render(<SeasonsBarChart />);
    });

    await waitFor(() => {
      expect(screen.getByText('Нет данных')).toBeInTheDocument();
    });
  });
});