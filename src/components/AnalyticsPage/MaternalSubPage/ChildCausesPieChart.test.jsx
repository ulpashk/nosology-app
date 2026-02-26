import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import ChildCausesPieChart from './ChildCausesPieChart';

const mockChildData = [
  { mkb_code: "P07", diagnosis: "Недоношенность", value: 50 },
  { mkb_code: "Q00", diagnosis: "Врожденные пороки", value: 30 }
];

beforeEach(() => {
  global.fetch = jest.fn(() => 
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockChildData) })
  );
});

afterEach(() => jest.clearAllMocks());

jest.mock('recharts', () => {
  return {
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    PieChart: ({ children }) => <svg data-testid="pie-chart">{children}</svg>,
    Pie: ({ data }) => <g data-testid="pie-segments">{data.map((d, i) => <circle key={i} />)}</g>,
    Cell: () => null,
    Tooltip: () => null,
  };
});

describe('ChildCausesPieChart Component', () => {
  test('renders chart with data', async () => {
    await act(async () => {
      render(<ChildCausesPieChart year="2023" />);
    });

    expect(screen.getByText('Причины детской смертности')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });
  });

  test('shows empty state', async () => {
    global.fetch = jest.fn(() => 
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    await act(async () => { render(<ChildCausesPieChart />); });
    
    await waitFor(() => {
      expect(screen.getByText('Нет данных')).toBeInTheDocument();
    });
  });

  test('toggles info tooltip', async () => {
    await act(async () => { render(<ChildCausesPieChart />); });
    fireEvent.click(screen.getByText('i'));
    expect(screen.getByText(/Распределение причин: пневмония/i)).toBeInTheDocument();
  });
});