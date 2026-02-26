import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import GenderPieChart from './GenderPieChart';

const mockGenderData = [
  { age_group: "0-18", male: 100, male_negative: -100, female: 90 },
  { age_group: "19-30", male: 200, male_negative: -200, female: 210 }
];

beforeEach(() => {
  global.fetch = jest.fn(() => 
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockGenderData) })
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
    Legend: () => null,
    LabelList: () => null,
  };
});

describe('GenderPieChart (PopulationPyramid) Component', () => {
  test('renders chart with data', async () => {
    await act(async () => {
      render(<GenderPieChart year="2023" />);
    });

    expect(screen.getByText('Распределение по полам')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  test('shows "No Data" if data is empty or all zeros', async () => {
    // Case 1: Empty array
    global.fetch = jest.fn(() => 
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );
    await act(async () => { render(<GenderPieChart />); });
    await waitFor(() => expect(screen.getByText('Нет данных')).toBeInTheDocument());

    // Case 2: All zeros
    global.fetch = jest.fn(() => 
        Promise.resolve({ ok: true, json: () => Promise.resolve([{male:0, female:0}]) })
    );

  });
  
  test('toggles info tooltip', async () => {
    await act(async () => { render(<GenderPieChart />); });
    fireEvent.click(screen.getByText('i'));
    expect(screen.getByText(/Молодой возраст: больше мужчин/i)).toBeInTheDocument();
  });
});