"use client";
import Indicators from "../../../components/AnalyticsPage/DUchetSubPage/Indicators"
import AgeGroupsBarChart from "../../../components/AnalyticsPage/DUchetSubPage/AgeGroupsBarChart"
import GenderPieChart from "../../../components/AnalyticsPage/DUchetSubPage/GenderPieChart"
import DiagnosesBarChart from "../../../components/AnalyticsPage/DUchetSubPage/DiagnosesBarChart"
import ForecastLineGraph from "../../../components/AnalyticsPage/DUchetSubPage/ForecastLineGraph"
import YearDynamicsBarChart from "../../../components/AnalyticsPage/DUchetSubPage/YearDynamicsBarChart"

export default function DUchetSubPage({ selectedYear, selectedMonth }){ 
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[45%] mb-4">
                <div className="min-h-0">
                    <ForecastLineGraph 
                        year={selectedYear} 
                        month={selectedMonth}
                    />
                </div>
                <div className="min-h-0">
                    <DiagnosesBarChart
                        year={selectedYear} 
                        month={selectedMonth}
                    />
                </div>
            </div>
    
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[50%]">
                <div className="min-h-0">
                    <GenderPieChart
                        year={selectedYear} 
                        month={selectedMonth}
                    />
                </div>
                <div className="min-h-0">
                    <AgeGroupsBarChart 
                        year={selectedYear} 
                        month={selectedMonth}
                    />
                </div>
                <div className="min-h-0 hidden lg:block">
                    <YearDynamicsBarChart 
                        year={selectedYear} 
                        month={selectedMonth}/>
                </div>
            </div>
        </>
    )
}