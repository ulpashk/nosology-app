import { render, screen } from '@testing-library/react';
import MaternalSubPage from './MaternalSubPage';

jest.mock('../../../components/AnalyticsPage/MaternalSubPage/MaternalDeathByYearLineGraph', () => () => <div data-testid="maternal-death-graph" />);
jest.mock('../../../components/AnalyticsPage/MaternalSubPage/DeathMoTable', () => () => <div data-testid="death-mo-table" />);
jest.mock('../../../components/AnalyticsPage/MaternalSubPage/AttachedMoTable', () => () => <div data-testid="attached-mo-table" />);
jest.mock('../../../components/AnalyticsPage/MaternalSubPage/MaternalCausesPieChart', () => () => <div data-testid="maternal-causes-chart" />);
jest.mock('../../../components/AnalyticsPage/MaternalSubPage/ChildCausesPieChart', () => () => <div data-testid="child-causes-chart" />);

describe('MaternalSubPage Component', () => {
  test('renders all child components', () => {
    render(<MaternalSubPage selectedYear="2023" selectedMonth="01" />);

    expect(screen.getByTestId('maternal-death-graph')).toBeInTheDocument();
    expect(screen.getByTestId('death-mo-table')).toBeInTheDocument();
    expect(screen.getByTestId('attached-mo-table')).toBeInTheDocument();
    expect(screen.getByTestId('maternal-causes-chart')).toBeInTheDocument();
    expect(screen.getByTestId('child-causes-chart')).toBeInTheDocument();
  });
});