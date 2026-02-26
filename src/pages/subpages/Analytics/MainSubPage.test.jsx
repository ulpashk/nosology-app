import { render, screen } from '@testing-library/react';
import MainSubPage from './MainSubPage';

jest.mock('../../../components/AnalyticsPage/MainSubPage/DeathByYearLineGraph', () => () => <div data-testid="death-line-graph" />);
jest.mock('../../../components/AnalyticsPage/MainSubPage/MkbBarChart', () => () => <div data-testid="mkb-chart" />);
jest.mock('../../../components/AnalyticsPage/MainSubPage/DeathCauseBarChart', () => () => <div data-testid="death-cause-chart" />);
jest.mock('../../../components/AnalyticsPage/MainSubPage/DeathMoBarChart', () => () => <div data-testid="death-mo-chart" />);
jest.mock('../../../components/AnalyticsPage/MainSubPage/GenderBarChart', () => () => <div data-testid="gender-chart" />);
jest.mock('../../../components/AnalyticsPage/MainSubPage/SeasonsBarChart', () => () => <div data-testid="seasons-chart" />);
jest.mock('../../../components/AnalyticsPage/MainSubPage/CauseByYearBarChart', () => () => <div data-testid="cause-year-chart" />);

describe('MainSubPage Component', () => {
  test('renders all child chart components', () => {
    render(<MainSubPage selectedYear="2023" selectedMonth="01" />);

    expect(screen.getByTestId('death-line-graph')).toBeInTheDocument();
    expect(screen.getByTestId('gender-chart')).toBeInTheDocument();
    expect(screen.getByTestId('seasons-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mkb-chart')).toBeInTheDocument();
    expect(screen.getByTestId('death-cause-chart')).toBeInTheDocument();
    expect(screen.getByTestId('death-mo-chart')).toBeInTheDocument();
    expect(screen.getByTestId('cause-year-chart')).toBeInTheDocument();
  });
});