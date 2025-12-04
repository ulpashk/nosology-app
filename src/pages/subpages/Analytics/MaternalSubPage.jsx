"use client";

import MaternalDeathByYearLineGraph from "../../../components/AnalyticsPage/MaternalSubPage/MaternalDeathByYearLineGraph"
import DeathMoTable from "../../../components/AnalyticsPage/MaternalSubPage/DeathMoTable"
import AttachedMoTable from "../../../components/AnalyticsPage/MaternalSubPage/AttachedMoTable"
import MaternalCausesPieChart from "../../../components/AnalyticsPage/MaternalSubPage/MaternalCausesPieChart"
import ChildCausesPieChart from "../../../components/AnalyticsPage/MaternalSubPage/ChildCausesPieChart"

export default function MaternalSubPage({ selectedYear, selectedMonth }){ 
    return (
        <>
        {/* Changed h-[45%] to h-auto or h-96 for mobile, and md:h-[45%] for desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] md:h-[45%] mb-4">
            <div className="min-h-0 h-full">
                <MaternalDeathByYearLineGraph />
            </div>
            <div className="min-h-0 h-full">
                <DeathMoTable 
                    year={selectedYear} 
                    month={selectedMonth}
                />
            </div>
        </div>

        {/* Changed h-[50%] to responsive height */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[400px] md:h-[50%]">
            <div className="min-h-0 h-full">
                <AttachedMoTable 
                    year={selectedYear} 
                    month={selectedMonth}
                />
            </div>
            <div className="min-h-0 h-full">
                <MaternalCausesPieChart 
                    year={selectedYear} 
                    month={selectedMonth}
                />
            </div>
            <div className="min-h-0 hidden lg:block h-full">
                <ChildCausesPieChart 
                    year={selectedYear} 
                    month={selectedMonth}
                />
            </div>
        </div>
    </>
    )
}