import { render, screen } from '@testing-library/react';
import DUchetSubPage from './DUchetSubPage';

jest.mock('../../../components/AnalyticsPage/DUchetSubPage/AgeGroupsBarChart', () => () => <div data-testid="age-groups-chart" />);
jest.mock('../../../components/AnalyticsPage/DUchetSubPage/GenderPieChart', () => () => <div data-testid="gender-chart" />);
jest.mock('../../../components/AnalyticsPage/DUchetSubPage/PatientsBarChart', () => () => <div data-testid="patients-chart" />);
jest.mock('../../../components/AnalyticsPage/DUchetSubPage/ForecastLineGraph', () => () => <div data-testid="forecast-graph" />);
jest.mock('../../../components/AnalyticsPage/DUchetSubPage/YearDynamicsBarChart', () => () => <div data-testid="year-dynamics-chart" />);

describe('DUchetSubPage Component', () => {
  test('renders all child components', () => {
    render(<DUchetSubPage selectedYear="2023" selectedMonth="05" />);

    expect(screen.getByTestId('forecast-graph')).toBeInTheDocument();
    expect(screen.getByTestId('patients-chart')).toBeInTheDocument();
    expect(screen.getByTestId('gender-chart')).toBeInTheDocument();
    expect(screen.getByTestId('age-groups-chart')).toBeInTheDocument();
    expect(screen.getByTestId('year-dynamics-chart')).toBeInTheDocument();
  });
});