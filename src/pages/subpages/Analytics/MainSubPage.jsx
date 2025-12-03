'use client';

import DeathByYearLineGraph from "../../../components/AnalyticsPage/MainSubPage/DeathByYearLineGraph"
import MkbBarChart from "../../../components/AnalyticsPage/MainSubPage/MkbBarChart"
import DeathCauseBarChart from "../../../components/AnalyticsPage/MainSubPage/DeathCauseBarChart"
import DeathMoBarChart from "../../../components/AnalyticsPage/MainSubPage/DeathMoBarChart"
import GenderBarChart from "../../../components/AnalyticsPage/MainSubPage/GenderBarChart" // This seems to map to your GenderDonutChart file
import SeasonsBarChart from "../../../components/AnalyticsPage/MainSubPage/SeasonsBarChart"
import CauseByYearBarChart from "../../../components/AnalyticsPage/MainSubPage/CauseByYearBarChart"

export default function MainSubPage({ selectedYear, selectedMonth }) { 

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[45%] mb-4">
                <div className="min-h-0">
                    {/* NO props passed here, as requested */}
                    <DeathByYearLineGraph />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="min-h-0">
                        <GenderBarChart year={selectedYear} month={selectedMonth} />
                    </div>
                    <div className="min-h-0">
                        <SeasonsBarChart year={selectedYear} month={selectedMonth} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[50%]">
                <div className="min-h-0">
                    <MkbBarChart year={selectedYear} month={selectedMonth} />
                </div>
                <div className="min-h-0">
                    <DeathCauseBarChart year={selectedYear} month={selectedMonth} />
                </div>
                <div className="min-h-0 hidden lg:block">
                    <DeathMoBarChart year={selectedYear} month={selectedMonth} />
                </div>
                <div className="min-h-0 hidden lg:block">
                    <CauseByYearBarChart year={selectedYear} month={selectedMonth} />
                </div>
            </div>
        </>
    )
}