"use client";

import MaternalDeathByYearLineGraph from "../../../components/AnalyticsPage/MaternalSubPage/MaternalDeathByYearLineGraph"
import DeathMoTable from "../../../components/AnalyticsPage/MaternalSubPage/DeathMoTable"
import AttachedMoTable from "../../../components/AnalyticsPage/MaternalSubPage/AttachedMoTable"
import MaternalCausesPieChart from "../../../components/AnalyticsPage/MaternalSubPage/MaternalCausesPieChart"
import ChildCausesPieChart from "../../../components/AnalyticsPage/MaternalSubPage/ChildCausesPieChart"

export default function MaternalSubPage({ selectedYear, selectedMonth }){ 
    return (
        <div className="flex flex-col gap-4 pb-4 lg:pb-0 h-auto lg:h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0 h-auto lg:h-[45%]">
                <div className="h-80 md:h-[450px] lg:h-auto lg:min-h-0 w-full">
                    <MaternalDeathByYearLineGraph />
                </div>
                <div className="h-96 md:h-[450px] lg:h-auto lg:min-h-0 w-full">
                    <DeathMoTable 
                        year={selectedYear} 
                        month={selectedMonth}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 shrink-0 h-auto lg:h-[50%]">
                <div className="h-96 md:h-[400px] lg:h-auto lg:min-h-0 w-full">
                    <AttachedMoTable 
                        year={selectedYear} 
                        month={selectedMonth}
                    />
                </div>
                <div className="h-80 md:h-[400px] lg:h-auto lg:min-h-0 w-full">
                    <MaternalCausesPieChart 
                        year={selectedYear} 
                        month={selectedMonth}
                    />
                </div>
                <div className="h-80 md:h-[400px] lg:h-auto lg:min-h-0 w-full">
                    <ChildCausesPieChart 
                        year={selectedYear} 
                        month={selectedMonth}
                    />
                </div>
            </div>
        </div>
    )
}