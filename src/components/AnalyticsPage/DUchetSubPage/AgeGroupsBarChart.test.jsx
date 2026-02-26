import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import AgeGroupsBarChart from './AgeGroupsBarChart';

const mockAgeData = [
  { age_group: "0-18", count: 150 },
  { age_group: "60+", count: 300 }
];

beforeEach(() => {
  global.fetch = jest.fn(() => 
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockAgeData) })
  );
});

afterEach(() => jest.clearAllMocks());

jest.mock('recharts', () => {
  return {
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    BarChart: ({ children }) => <svg data-testid="bar-chart">{children}</svg>, // SVG Fix
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    Cell: () => null,
    LabelList: () => null,
  };
});

describe('AgeGroupsBarChart Component', () => {
  test('renders successfully', async () => {
    await act(async () => {
      render(<AgeGroupsBarChart year="2022" />);
    });
    
    expect(screen.getByText('Возрастные группы')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  test('handles no data', async () => {
    global.fetch = jest.fn(() => 
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    await act(async () => { render(<AgeGroupsBarChart />); });

    await waitFor(() => {
      expect(screen.getByText('Нет данных')).toBeInTheDocument();
    });
  });

  test('toggles info tooltip', async () => {
    await act(async () => { render(<AgeGroupsBarChart />); });
    fireEvent.click(screen.getByText('i'));
    expect(screen.getByText(/Молодые группы преобладают/i)).toBeInTheDocument();
  });
});