import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import PatientsBarChart from './PatientsBarChart';

const mockPatientsData = [
  { name: "Hospital A", count: 500 },
  { name: "Hospital B", count: 300 }
];

beforeEach(() => {
  global.fetch = jest.fn(() => 
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockPatientsData) })
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

describe('PatientsBarChart Component', () => {
  test('renders chart with data', async () => {
    await act(async () => {
      render(<PatientsBarChart year="2023" />);
    });

    expect(screen.getByText('ТОП-15 МО по числу пациентов')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  test('handles empty data state', async () => {
    global.fetch = jest.fn(() => 
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    await act(async () => {
      render(<PatientsBarChart />);
    });

    await waitFor(() => {
      expect(screen.getByText('Нет данных')).toBeInTheDocument();
    });
  });

  test('toggles info tooltip', async () => {
    await act(async () => { render(<PatientsBarChart />); });
    fireEvent.click(screen.getByText('i'));
    expect(screen.getByText(/Алматинский онкологический центр/i)).toBeInTheDocument();
  });
});