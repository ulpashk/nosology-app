'use client';

import DeathByYearLineGraph from "../../../components/AnalyticsPage/MainSubPage/DeathByYearLineGraph"
import MkbBarChart from "../../../components/AnalyticsPage/MainSubPage/MkbBarChart"
import DeathCauseBarChart from "../../../components/AnalyticsPage/MainSubPage/DeathCauseBarChart"
import DeathMoBarChart from "../../../components/AnalyticsPage/MainSubPage/DeathMoBarChart"
import GenderBarChart from "../../../components/AnalyticsPage/MainSubPage/GenderBarChart"
import SeasonsBarChart from "../../../components/AnalyticsPage/MainSubPage/SeasonsBarChart"
import CauseByYearBarChart from "../../../components/AnalyticsPage/DUchetSubPage/CauseByYearBarChart"

export default function MainPage() { 

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[45%] mb-4">
                <div className="min-h-0">
                    <DeathByYearLineGraph />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="min-h-0">
                        <GenderBarChart />
                    </div>
                    <div className="min-h-0">
                        <SeasonsBarChart />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[50%]">
                <div className="min-h-0">
                    <MkbBarChart />
                </div>
                <div className="min-h-0">
                    <DeathCauseBarChart />
                </div>
                <div className="min-h-0 hidden lg:block">
                    <DeathMoBarChart />
                </div>
                <div className="min-h-0 hidden lg:block">
                    <CauseByYearBarChart />
                </div>
            </div>
        </>
    )
}