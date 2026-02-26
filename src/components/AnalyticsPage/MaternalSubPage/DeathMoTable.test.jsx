import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import DeathMoTable from './DeathMoTable';

const mockMoData = {
  results: [
    { name: "Городская больница №1", maternal_count: 2, child_count: 5 },
    { name: "Роддом №2", maternal_count: 1, child_count: 0 }
  ]
};

beforeEach(() => {
  global.fetch = jest.fn(() => 
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockMoData) })
  );
});

afterEach(() => jest.clearAllMocks());

describe('DeathMoTable Component', () => {
  test('renders table with data', async () => {
    await act(async () => {
      render(<DeathMoTable year="2023" />);
    });

    expect(screen.getByText('Материнская смерть по МО')).toBeInTheDocument();
    expect(screen.getByText('Название МО')).toBeInTheDocument(); // Header check

    await waitFor(() => {
      expect(screen.getByText('Городская больница №1')).toBeInTheDocument();
      expect(screen.getByText('Роддом №2')).toBeInTheDocument();
    });
  });

  test('shows empty state', async () => {
    global.fetch = jest.fn(() => 
      Promise.resolve({ ok: true, json: () => Promise.resolve({ results: [] }) })
    );

    await act(async () => {
      render(<DeathMoTable />);
    });

    await waitFor(() => {
      expect(screen.getByText('Нет данных')).toBeInTheDocument();
    });
  });

  test('toggles info tooltip', async () => {
    await act(async () => { render(<DeathMoTable />); });
    fireEvent.click(screen.getByText('i'));
    expect(screen.getByText(/Таблица показывает количество смертей/i)).toBeInTheDocument();
  });
});