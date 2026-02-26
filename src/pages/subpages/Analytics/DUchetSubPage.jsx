"use client";
import AgeGroupsBarChart from "../../../components/AnalyticsPage/DUchetSubPage/AgeGroupsBarChart"
import GenderPieChart from "../../../components/AnalyticsPage/DUchetSubPage/GenderPieChart"
import PatientsBarChart from "../../../components/AnalyticsPage/DUchetSubPage/PatientsBarChart"
import ForecastLineGraph from "../../../components/AnalyticsPage/DUchetSubPage/ForecastLineGraph"
import YearDynamicsBarChart from "../../../components/AnalyticsPage/DUchetSubPage/YearDynamicsBarChart"

export default function DUchetSubPage({ selectedYear, selectedMonth }){ 
    return (
        <div className="flex flex-col gap-4 pb-4 lg:pb-0 h-auto lg:h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0 h-auto lg:h-[45%]">
                <div className="h-80 md:h-[400px] lg:h-auto lg:min-h-0 w-full">
                    <ForecastLineGraph
                        year={selectedYear}
                        month={selectedMonth}
                    />
                </div>
                <div className="h-96 md:h-[400px] lg:h-auto lg:min-h-0 w-full">
                    <PatientsBarChart
                        year={selectedYear} 
                        month={selectedMonth}
                    />
                </div>
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 shrink-0 h-auto lg:h-[50%]">
                <div className="h-80 md:h-[400px] lg:h-auto lg:min-h-0 w-full">
                    <GenderPieChart
                        year={selectedYear} 
                        month={selectedMonth}
                    />
                </div>
                <div className="h-80 md:h-[400px] lg:h-auto lg:min-h-0 w-full">
                    <AgeGroupsBarChart 
                        year={selectedYear} 
                        month={selectedMonth}
                    />
                </div>
                <div className="h-80 md:h-[400px] lg:h-auto lg:min-h-0 w-full">
                    <YearDynamicsBarChart 
                        year={selectedYear} 
                        month={selectedMonth}/>
                </div>
            </div>
        </div>
    )
}