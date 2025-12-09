"use client";
import AgeGroupsBarChart from "../../../components/AnalyticsPage/DUchetSubPage/AgeGroupsBarChart"
import GenderPieChart from "../../../components/AnalyticsPage/DUchetSubPage/GenderPieChart"
import PatientsBarChart from "../../../components/AnalyticsPage/DUchetSubPage/PatientsBarChart"
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
                    <PatientsBarChart
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