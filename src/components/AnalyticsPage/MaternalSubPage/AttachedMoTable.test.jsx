import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import AttachedMoTable from './AttachedMoTable';

const mockAttachedData = {
  results: [
    { name: "Поликлиника №5", maternal_count: 1, child_count: 2 }
  ]
};

beforeEach(() => {
  global.fetch = jest.fn(() => 
    Promise.resolve({ ok: true, json: () => Promise.resolve(mockAttachedData) })
  );
});

afterEach(() => jest.clearAllMocks());

describe('AttachedMoTable Component', () => {
  test('renders table with data', async () => {
    await act(async () => {
      render(<AttachedMoTable year="2023" />);
    });

    expect(screen.getByText('Материнская смерть (Прикрепл.)')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Поликлиника №5')).toBeInTheDocument();
    });
  });

  test('shows empty state', async () => {
    global.fetch = jest.fn(() => 
      Promise.resolve({ ok: true, json: () => Promise.resolve({ results: [] }) })
    );

    await act(async () => {
      render(<AttachedMoTable />);
    });

    await waitFor(() => {
      expect(screen.getByText('Нет данных')).toBeInTheDocument();
    });
  });

  test('toggles info tooltip', async () => {
    await act(async () => { render(<AttachedMoTable />); });
    fireEvent.click(screen.getByText('i'));
    expect(screen.getByText(/Таблица по прикреплённым МО/i)).toBeInTheDocument();
  });
});