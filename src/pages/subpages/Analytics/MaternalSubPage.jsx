"use client";

import MaternalDeathByYearLineGraph from "../../../components/AnalyticsPage/MaternalSubPage/MaternalDeathByYearLineGraph"
import DeathMoTable from "../../../components/AnalyticsPage/MaternalSubPage/DeathMoTable"
import AttachedMoTable from "../../../components/AnalyticsPage/MaternalSubPage/AttachedMoTable"

export default function MaternalSubPage(){
    return (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[45%] mb-4">
            <div className="min-h-0">
                <MaternalDeathByYearLineGraph />
            </div>
            <div className="min-h-0">
                <DeathMoTable/>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[50%]">
            <div className="min-h-0">
                <AttachedMoTable />
            </div>
            <div className="min-h-0">
                {/* <DeathCauseBarChart /> */}
            </div>
            <div className="min-h-0 hidden lg:block">
                {/* <DeathMoBarChart /> */}
            </div>
        </div>
    </>
    )
}